/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { Slider } from '../Slider';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<Slider />', () => {
  it('should render slider', () => {
    const { container, getByRole } = renderWithTheme(
      <Slider accessibilityLabel="Volume" />,
    );
    expect(container).toMatchSnapshot();
    expect(getByRole('slider')).toBeInTheDocument();
  });

  it('should render with label', () => {
    const { getByText } = renderWithTheme(
      <Slider accessibilityLabel="Volume" label="Volume" />,
    );
    expect(getByText('Volume')).toBeInTheDocument();
  });

  it('should show current value when showValue is true', () => {
    const { getByText } = renderWithTheme(
      <Slider accessibilityLabel="Volume" showValue defaultValue={42} />,
    );
    expect(getByText('42')).toBeInTheDocument();
  });

  it('should render as disabled when isDisabled is true', () => {
    const { getByRole } = renderWithTheme(
      <Slider accessibilityLabel="Volume" isDisabled />,
    );
    expect(getByRole('slider')).toBeDisabled();
  });

  it('should use defaultValue as initial value', () => {
    const { getByRole } = renderWithTheme(
      <Slider accessibilityLabel="Volume" defaultValue={30} />,
    );
    expect(getByRole('slider')).toHaveValue('30');
  });

  it('should respect min and max bounds', () => {
    const { getByRole } = renderWithTheme(
      <Slider accessibilityLabel="Volume" min={10} max={50} defaultValue={200} />,
    );
    expect(getByRole('slider')).toHaveValue('50');
  });

  it('should call onChange with new value', () => {
    const onChangeFn = jest.fn();
    const { getByRole } = renderWithTheme(
      <Slider accessibilityLabel="Volume" onChange={onChangeFn} />,
    );
    const slider = getByRole('slider');
    Object.defineProperty(slider, 'value', { configurable: true, value: '60' });
    slider.dispatchEvent(new Event('change', { bubbles: true }));
    expect(onChangeFn).toHaveBeenCalled();
  });

  it('should support controlled value', () => {
    const { getByRole } = renderWithTheme(
      <Slider accessibilityLabel="Volume" value={75} onChange={jest.fn()} />,
    );
    expect(getByRole('slider')).toHaveValue('75');
  });

  it('should pass testID', () => {
    const { getByTestId } = renderWithTheme(
      <Slider accessibilityLabel="Volume" testID="slider-test" />,
    );
    expect(getByTestId('slider-test')).toBeInTheDocument();
  });
});
