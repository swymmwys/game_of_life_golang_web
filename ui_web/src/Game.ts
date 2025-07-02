import { type IObservableValue, observable, runInAction } from "mobx";

interface GoBackendImpl {
  initGame(w: number, h: number): void;
  setSize(w: number, h: number): void;
  getHeight(): number;
  getWidth(): number;
  getCellValue(i: number, j: number): 1 | 0;
  setCellValue(i: number, j: number, value: boolean): void;
  iterate(): 1 | 0;
  resetGame(): void;
  getMemPointer(): number;
  mem: WebAssembly.Memory;
}

export interface Game {
  init(size: number): Promise<void>;

  getCell(i: number, j: number): ReadonlyCell;

  setCellValue(i: number, j: number, value: boolean): void;

  iterate(): boolean;

  reset(): void;

  size: number;

  readonly generation: number;

  readonly field: ReadonlyCell[];
}

const noopThrow = () => {
  throw new Error("not implemented");
};

const goBackendImplStub: GoBackendImpl = {
  initGame: noopThrow,
  getCellValue: noopThrow,
  setSize: noopThrow,
  setCellValue: noopThrow,
  iterate: noopThrow,
  resetGame: noopThrow,
  getMemPointer: noopThrow,
  getHeight: noopThrow,
  getWidth: noopThrow,
  get mem() {
    return noopThrow();
  },
};

export interface ReadonlyCell {
  readonly x: number;
  readonly y: number;
  readonly value: { get(): boolean };
}

export class Cell implements ReadonlyCell {
  readonly x: number;
  readonly y: number;
  readonly value: IObservableValue<boolean>;

  constructor(x: number, y: number, initialValue = false) {
    this.x = x;
    this.y = y;
    this.value = observable.box(initialValue);
  }
}

export class GameDefault implements Game {
  private _goBackend: GoBackendImpl = goBackendImplStub;
  private _memory: Uint32Array<ArrayBuffer> = new Uint32Array(0);

  private readonly _generation = observable.box(0);
  private readonly _field = observable.array<Cell>([], { deep: false });

  // only for external usage
  get field(): ReadonlyCell[] {
    return this._field;
  }

  private _initResolvers: PromiseWithResolvers<void> | null = null;

  get size(): number {
    // square root of length, since we have a square field
    return Math.sqrt(this._field.length);
  }

  set size(size: number) {
    this._goBackend.setSize(size, size);

    runInAction(() => {
      this._syncGameState();
    });
  }

  get generation(): number {
    return this._generation.get();
  }

  async init(size: number): Promise<void> {
    if (this._initResolvers != null) {
      return this._initResolvers.promise;
    }

    this._initResolvers = Promise.withResolvers<void>();

    try {
      const go = new Go();
      const result = await WebAssembly.instantiateStreaming(
        fetch("main.wasm"),
        go.importObject,
      );
      void go.run(result.instance); // it never resolves

      const exports = result.instance.exports;
      this._goBackend = {
        initGame: exports.initGame as GoBackendImpl["initGame"],
        getCellValue: exports.getCellValue as GoBackendImpl["getCellValue"],
        setSize: exports.setSize as GoBackendImpl["setSize"],
        setCellValue: exports.setCellValue as GoBackendImpl["setCellValue"],
        iterate: exports.iterate as GoBackendImpl["iterate"],
        resetGame: exports.resetGame as GoBackendImpl["resetGame"],
        getMemPointer: exports.getMemPointer as GoBackendImpl["getMemPointer"],
        mem: exports.mem as GoBackendImpl["mem"],
        getWidth: exports.getWidth as GoBackendImpl["getWidth"],
        getHeight: exports.getHeight as GoBackendImpl["getHeight"],
      };
      this._goBackend.initGame(size, size);

      runInAction(() => {
        this._syncGameState();
      });
    } catch {
      this._initResolvers.reject();
    }

    this._initResolvers.resolve();
    return this._initResolvers.promise;
  }

  reset(): void {
    this._goBackend.resetGame();

    runInAction(() => {
      this._syncGameState();
      this._generation.set(0);
    });
  }

  getCell(x: number, y: number): ReadonlyCell {
    const size = this._goBackend.getHeight();

    const cell = this._field[y * size + x];

    if (!cell) {
      throw new Error(`missing cell x:${x} y:${y}`);
    }

    return cell;
  }

  private _syncMemory(): void {
    const ptr = this._goBackend.getMemPointer();
    const size = this._goBackend.getHeight();

    this._memory = new Uint32Array<ArrayBuffer>(
      this._goBackend.mem.buffer,
      ptr,
      size * size,
    );
  }

  private _syncGameState(): void {
    this._syncMemory();

    const newSize = this._goBackend.getHeight();
    const prevSize = this.size;
    const newState: Cell[] =
      newSize === prevSize ? this._field : new Array(newSize);

    for (let i = 0; i < newSize * newSize; i++) {
      const x = i % newSize;
      const y = Math.floor(i / newSize);
      let cell: Cell | null = null;

      if (x < prevSize && y < prevSize) {
        const index = y * prevSize + x;
        cell = this._field.at(index)!;
      }

      const newIndex = y * newSize + x;
      newState[newIndex] = cell ?? new Cell(x, y);
      newState[newIndex].value.set(this._memory[newIndex] === 1);
    }

    if (newState !== this._field) {
      this._field.replace(newState);
    }
  }

  setCellValue(x: number, y: number, value: boolean): void {
    this._goBackend.setCellValue(x, y, value);
    this._syncMemory();

    runInAction(() => {
      const index = y * this._goBackend.getHeight() + x;
      const cell = this._field.at(index);

      if (cell == null) {
        throw new Error(`missing cell x:${x} y:${y}`);
      }

      cell.value.set(value);
    });
  }

  iterate(): boolean {
    const next = this._goBackend.iterate() === 1;

    if (!next) {
      return false;
    }

    runInAction(() => {
      this._generation.set(this._generation.get() + 1);
      this._syncGameState();
    });

    return true;
  }
}
