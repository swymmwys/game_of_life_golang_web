//go:build js && wasm

package main

func main() {
	select {}
}

var gameField GameField

//go:wasmexport initGame
func initGame(h, w int32) {
	gameField = MakeGameField(int(h), int(w))
}

//go:wasmexport getMemPointer
func getMemPointer() *int32 {
	rows := len(gameField)
	cols := len(gameField[0])
	flat := make([]int32, rows*cols)
	for i := 0; i < rows; i++ {
		for j := 0; j < cols; j++ {
			if gameField[i][j].val {
				flat[i*cols+j] = 1
			} else {
				flat[i*cols+j] = 0
			}
		}
	}
	return &flat[0]
}

//go:wasmexport resetGame
func resetGame() {
	for i := 0; i < len(gameField); i++ {
	    cols := len(gameField[i])
		for j := 0; j < cols; j++ {
            gameField[i][j].val = false
		}
	}
}

//go:wasmexport iterate
func iterate() bool {
	return gameField.iterate()
}

//go:wasmexport setCellValue
func setCellValue(x, y int32, val bool) {
	gameField.setCell(int(x), int(y), val)
}

//go:wasmexport getCellValue
func getCellValue(x, y int32) int32 {
	if gameField.getCell(int(x), int(y)).val == true {
	    return 1
	} else {
	    return 0
	}
}

//go:wasmexport setSize
func setSize(w, h int32) {
	gameField.setSize(int(w), int(h))
}

//go:wasmexport getHeight
func getHeight() int32 {
	return int32(gameField.getHeight())
}

//go:wasmexport getWidth
func getWidth() int32 {
	return int32(gameField.getWidth())
}

