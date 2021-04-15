import React from 'react';
import { render } from '@testing-library/react';

import App from "../App";
import {calculateNextField, getRandomlyFilledField, selectNeighbourCellIndexes} from "../utils";
import {fieldState1, fieldState2, fieldState3, fieldState4} from "../mocks";

it('should render app component', () => {
  const { container } = render(<App />)
  expect(container.firstChild).toHaveClass('app-container')
})

test("should return randomly filled array", () => {
  const field = getRandomlyFilledField(50, 50, 10);

  expect(field.length).toEqual(50 * 50)
  expect(field.filter(Boolean).length).toEqual(10)
});

test("should calculate next field", () => {
  const nextField1 = calculateNextField(fieldState1, 10, 10);
  const nextField2 = calculateNextField(fieldState2, 10, 10);
  const nextField3 = calculateNextField(fieldState3, 10, 10);

  expect(nextField1).toEqual(fieldState2)
  expect(nextField2).toEqual(fieldState3)
  expect(nextField3).toEqual(fieldState4)
});

test("should select neighbour cell indexes relative to the alive cell", () => {
  const indexesSet1 = selectNeighbourCellIndexes(0, 10, 10)
  const indexesSet2 = selectNeighbourCellIndexes(15, 10, 10)
  const indexesSet3 = selectNeighbourCellIndexes(95, 10, 10)

  expect(indexesSet1).toEqual([1, 10, 11])
  expect(indexesSet2).toEqual([5, 6, 4, 14, 16, 25, 26, 24])
  expect(indexesSet3).toEqual([85, 86, 84, 94, 96])
});


