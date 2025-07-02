package main

import "fmt"

type Cell struct {
	x   int
	y   int
	val bool
}

func (cell *Cell) print() {
	if cell.val {
		fmt.Print(("■ 1"))
	} else {
		fmt.Print(("□ 0"))
	}
}

type GameField [][]Cell

func (gf *GameField) iterate() bool {
	h := len(*gf)
	w := len((*gf)[0])
	size := h * w

	dying := make([]*Cell, 0, size)
	newborn := make([]*Cell, 0, size)

	for _, row := range *gf {
		for _, cell := range row {
			// cell.print()

			n := gf.countNeighbors(&cell)

			if cell.val && (n > 3 || n < 2) {
				dying = append(dying, &cell)
			}

			if !cell.val && n == 3 {
				newborn = append(newborn, &cell)
			}
		}

		fmt.Println()
	}

	fmt.Println()
	fmt.Println("-------------------------")
	fmt.Println()

	contin := false

	for _, d := range dying {
		(*gf)[d.y][d.x].val = false
		contin = true
	}

	for _, n := range newborn {
		(*gf)[n.y][n.x].val = true
		contin = true
	}

	return contin
}

func (gf *GameField) countNeighbors(cell *Cell) (n int) {
	neighbors := []*Cell{
		gf.getCell(cell.x-1, cell.y+1),
		gf.getCell(cell.x, cell.y+1),
		gf.getCell(cell.x+1, cell.y+1),
		gf.getCell(cell.x+1, cell.y),
		gf.getCell(cell.x+1, cell.y-1),
		gf.getCell(cell.x, cell.y-1),
		gf.getCell(cell.x-1, cell.y-1),
		gf.getCell(cell.x-1, cell.y),
	}

	for _, neighbor := range neighbors {
		if neighbor != nil && neighbor.val {
			n++
		}
	}

	return
}

func (gf *GameField) getCell(x, y int) *Cell {
	if y >= 0 && y < len(*gf) && x >= 0 && x < len((*gf)[0]) {
		return &(*gf)[y][x]
	}

	return nil
}

func (gf *GameField) setCell(x, y int, val bool) {
	(*gf)[y][x].val = val
}

func (gf *GameField) setSize(w, h int) {
    if h <= 0 || w <= 0 {
        return // Invalid dimensions
    }

    currentH := len(*gf)
    currentW := 0
    if currentH > 0 {
        currentW = len((*gf)[0])
    }

    // Handle height changes
    if h > currentH {
        // Extend height - add new rows
        for i := currentH; i < h; i++ {
            newRow := make([]Cell, currentW)
            for j := range newRow {
                newRow[j].x = j
                newRow[j].y = i
                newRow[j].val = false
            }
            *gf = append(*gf, newRow)
        }
    } else if h < currentH {
        // Shrink height - remove rows
        *gf = (*gf)[:h]
    }

    // Handle width changes
    if w != currentW {
        for i := 0; i < len(*gf); i++ {
            if w > currentW {
                // Extend width - add new cells to each row
                for j := currentW; j < w; j++ {
                    newCell := Cell{x: j, y: i, val: false}
                    (*gf)[i] = append((*gf)[i], newCell)
                }
            } else {
                // Shrink width - truncate each row
                (*gf)[i] = (*gf)[i][:w]
            }
        }
    }
}

func (gf *GameField) getHeight() int {
    return len(*gf)
}

func (gf *GameField) getWidth() int {
    return len((*gf)[0])
}

func MakeGameField(w, h int) GameField {
	field := make(GameField, h)
	for i := range field {
		field[i] = make([]Cell, w)
		for j := range field[i] {
			field[i][j].x = j
			field[i][j].y = i
		}
	}

	return field
}
