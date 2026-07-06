import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { SpinWheel } from '../SpinWheel.native';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

const hourValues = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

describe('<SpinWheel /> (native)', () => {
  it('should render with default props', () => {
    const { toJSON } = renderWithTheme(
      <SpinWheel values={hourValues} selectedValue="03" onChange={jest.fn()} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render active styling for the selected value', () => {
    const { toJSON } = renderWithTheme(
      <SpinWheel values={hourValues} selectedValue="05" activeIndex={4} onChange={jest.fn()} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should call onChange with value and index when an item is pressed', () => {
    const onChange = jest.fn();
    const { getByText } = renderWithTheme(
      <SpinWheel values={hourValues} selectedValue="01" onChange={onChange} />,
    );

    fireEvent.press(getByText('07'));

    expect(onChange).toHaveBeenCalledWith('07', 6);
  });

  it('should call onActiveIndexChange when an item is pressed', () => {
    const onActiveIndexChange = jest.fn();
    const { getByText } = renderWithTheme(
      <SpinWheel
        values={hourValues}
        selectedValue="01"
        onChange={jest.fn()}
        onActiveIndexChange={onActiveIndexChange}
      />,
    );

    fireEvent.press(getByText('09'));

    expect(onActiveIndexChange).toHaveBeenCalledWith(8);
  });

  it('should visually position using displayValue when provided', () => {
    const minuteValues = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));
    const { toJSON } = renderWithTheme(
      <SpinWheel
        values={minuteValues}
        selectedValue="03"
        displayValue="05"
        onChange={jest.fn()}
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
