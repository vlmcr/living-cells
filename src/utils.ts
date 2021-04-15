import {Direction} from "./types";

export const getRandomFieldIndex = (width: number, height: number): number => Math.floor(Math.random() * width * height)

export const sum = (a: number, b: number): number => a + b

const getDirectionIndexMap = (width: number) => new Map<Direction, (i: number) => number>([
  [Direction.Up, (i) => i - width],
  [Direction.UpRight, (i) => i - width + 1],
  [Direction.UpLeft, (i) => i - width - 1],
  [Direction.Left, (i) => i - 1],
  [Direction.Right, (i) => i + 1],
  [Direction.Down, (i) => i + width],
  [Direction.DownRight, (i) => i + width + 1],
  [Direction.DownLeft, (i) => i + width - 1]
])

export function getRandomlyFilledField(width: number, height: number, randomAliveCellCount: number): number[] {
  const emptyArray = new Array(width * height).fill(0)

  for(let i = 0; i < randomAliveCellCount; i++) {
    emptyArray[getRandomFieldIndex(width, height)] = 1;
  }

  return emptyArray
}

export function calculateNextField(field: number[], width: number, height: number) {
  const nextField = [...field];

  const valueIndexOfCells = field.map((value, index) => [value, index])
  const aliveCellValueIndexes = valueIndexOfCells.filter(([value]) => Boolean(value))

  let deadCellIndexesToCheck = new Set<number>()

  aliveCellValueIndexes.forEach(([, index]) => {
    const neighbourCellIndexes = selectNeighbourCellIndexes(index, width, height)

    neighbourCellIndexes.forEach(index => deadCellIndexesToCheck.add(index))

    const count = findCountOfAliveCells(neighbourCellIndexes, field)

    nextField[index] = count === 2 || count === 3 ? 1 : 0;
  })

  deadCellIndexesToCheck.forEach((cellIndex) => {
    const aliveCellsCount = findCountOfAliveCells(selectNeighbourCellIndexes(cellIndex, width, height), field)

    if (aliveCellsCount === 3) {
      nextField[cellIndex] = 1;
    }
  })

  return nextField
}

export const selectNeighbourCellIndexes = (index: number, width: number, height: number): number[] => {
  const mapDirectionToIndex = getDirectionIndexMap(width)

  const right = (index + 1) % width === 0
  const bottom = index >= ((width * height) - width)
  const top = index < width
  const left = index % width === 0

  if (top) {
    mapDirectionToIndex.delete(Direction.Up)
    mapDirectionToIndex.delete(Direction.UpLeft)
    mapDirectionToIndex.delete(Direction.UpRight)
  }

  if (bottom) {
    mapDirectionToIndex.delete(Direction.Down)
    mapDirectionToIndex.delete(Direction.DownLeft)
    mapDirectionToIndex.delete(Direction.DownRight)
  }

  if (right) {
    mapDirectionToIndex.delete(Direction.Right)
    mapDirectionToIndex.delete(Direction.UpRight)
    mapDirectionToIndex.delete(Direction.DownRight)
  }

  if (left) {
    mapDirectionToIndex.delete(Direction.Left)
    mapDirectionToIndex.delete(Direction.DownLeft)
    mapDirectionToIndex.delete(Direction.DownLeft)
  }

  return Array.from(mapDirectionToIndex.values()).map((func) => func(index))
}

export const findCountOfAliveCells = (indexesToCheck: number[], field: number[]) => indexesToCheck
  .map(value => field[value])
  .reduce(sum, 0)
