import React, {useEffect, useState} from 'react';
import './App.css';

const width = 50;
const height = 50;

const randomPointsCount = 10;

const getRandomPoint = (): [number, number] => [
  Math.floor(Math.random() * width),
  Math.floor(Math.random() * height)
]

const fillArray = (length: number): number[] => {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr[i] = 0
  }
  return arr;
}

const getRandomPoints = (): Array<[number, number]> => {
  const arr: Array<[number, number]> = []
  for (let i = 0; i < randomPointsCount; i++) {
    arr.push(getRandomPoint())
  }
  return arr;
}

const fillArrayWithPoints = (points: Array<[number, number]>, array: number[]) => {
  points.forEach(points => {
    const x = points[0]
    const y = points[1]
    const index = (x * width) + y
    array[index] = 1
  })
  return array;
}



function App() {
  const randomPoints = getRandomPoints()
  const emptyArr = fillArray(width * height)
  const withLivePoints = fillArrayWithPoints(randomPoints, emptyArr)
  const [filed, setField] = useState<number[]>(withLivePoints)

  const delta = 10000;
  let prevTime = Date.now();

  const update = () => {
    const time = Date.now();
    if ((time - prevTime) > delta) {
      prevTime = Date.now();


    }

    window.requestAnimationFrame(() => update());
  }

  useEffect(() => {
    update()
  }, [])

  return (
    <div className="app-container">
      {filed.map(point => <div className={point === 1 ? 'live' : 'died'} />)}
    </div>
  );
}

export default App;
