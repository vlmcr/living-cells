import React, {useEffect, useReducer, useRef} from "react";
import {useAnimationFrame} from "./useAnimationFrame";
import {findCountOfAliveCells, getRandomFieldIndex, selectNeighbourCellIndexes} from "./utils";
import {config} from "./config";

import './App.css';


function App() {
  const {width, height, deltaTime, randomAliveCellCount} = config;

  const initField = getRandomlyFilledField(width, height)
  const fieldRef = useRef<number[]>(initField)
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  useAnimationFrame(calculateNextField, deltaTime)

  function getRandomlyFilledField(width: number, height: number): number[] {
    const emptyArray = new Array(width * height).fill(0)

    for(let i = 0; i < randomAliveCellCount; i++) {
      emptyArray[getRandomFieldIndex(width, height)] = 1;
    }

    return emptyArray
  }

  function calculateNextField() {
    const nextField = [...fieldRef.current];

    const valueIndexOfCells = fieldRef.current.map((value, index) => [value, index])
    const aliveCellValueIndexes = valueIndexOfCells.filter(([value]) => Boolean(value))

    let deadCellIndexesToCheck = new Set<number>()

    aliveCellValueIndexes.forEach(([, index]) => {
      const neighbourCellIndexes = selectNeighbourCellIndexes(index, width, height)

      neighbourCellIndexes.forEach(index => deadCellIndexesToCheck.add(index))

      const count = findCountOfAliveCells(neighbourCellIndexes, fieldRef.current)

      nextField[index] = count === 2 || count === 3 ? 1 : 0;
    })

    deadCellIndexesToCheck.forEach((cellIndex) => {
      const aliveCellsCount = findCountOfAliveCells(selectNeighbourCellIndexes(cellIndex, width, height), fieldRef.current)

      if (aliveCellsCount === 3) {
        nextField[cellIndex] = 1;
      }
    })

    fieldRef.current = [...nextField]
    forceUpdate()
  }

  useEffect(() => {
    document.documentElement.style.setProperty('--width', `${width}`);
    document.documentElement.style.setProperty('--height', `${height}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="app-container">
      {fieldRef.current.map((point, index) => <div key={index} className={point === 1 ? 'cell alive' : 'cell died'} />)}
    </div>
  );
}

export default App;
