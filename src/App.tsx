import React, {useEffect, useReducer, useRef} from "react";
import {useAnimationFrame} from "./useAnimationFrame";
import {calculateNextField, getRandomlyFilledField} from "./utils";
import {config} from "./config";
import './App.css';

function App() {
  const {width, height, deltaTime, randomAliveCellCount} = config;

  const initField = getRandomlyFilledField(width, height, randomAliveCellCount)
  const fieldRef = useRef<number[]>(initField)
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  useAnimationFrame(() => {
    fieldRef.current = calculateNextField(fieldRef.current, width, height)
    forceUpdate()
  }, deltaTime)

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
