import React from 'react';
import { fireEvent } from '@testing-library/react';
import { SliderInput } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<SliderInput />', () => {
  it('should render with default props', () => {
    const { getByRole, getByText } = renderWithTheme(<SliderInput label="Test Slider" />);
    expect(getByRole('slider')).toBeTruthy();
    expect(getByText('Test Slider')).toBeTruthy();
  });

  it('should call onChange when value changes via keyboard', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <SliderInput label="Test" value={50} onChange={onChange} min={0} max={100} step={1} />,
    );
    const slider = getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith({ value: 51 });
  });

  it('should respect min/max constraints via keyboard', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <SliderInput label="Test" value={100} onChange={onChange} min={0} max={100} step={1} />,
    );
    const slider = getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should jump to min/max on Home/End keys', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <SliderInput label="Test" value={50} onChange={onChange} min={0} max={100} step={1} />,
    );
    const slider = getByRole('slider');
    fireEvent.keyDown(slider, { key: 'Home' });
    expect(onChange).toHaveBeenCalledWith({ value: 0 });
    fireEvent.keyDown(slider, { key: 'End' });
    expect(onChange).toHaveBeenCalledWith({ value: 100 });
  });

  it('should render in disabled state', () => {
    const { getByRole } = renderWithTheme(
      <SliderInput label="Test" value={50} onChange={jest.fn()} isDisabled />,
    );
    expect(getByRole('slider')).toHaveAttribute('aria-disabled', 'true');
  });

  it('should render error text when validationState is error', () => {
    const { getByText } = renderWithTheme(
      <SliderInput
        label="Test"
        value={50}
        onChange={jest.fn()}
        validationState="error"
        errorText="Something went wrong"
      />,
    );
    expect(getByText('Something went wrong')).toBeTruthy();
  });

  it('should render help text', () => {
    const { getByText } = renderWithTheme(
      <SliderInput label="Test" value={50} onChange={jest.fn()} helpText="Some guidance" />,
    );
    expect(getByText('Some guidance')).toBeTruthy();
  });

  it('should set correct ARIA attributes', () => {
    const { getByRole } = renderWithTheme(
      <SliderInput label="Radius" value={12} onChange={jest.fn()} min={0} max={24} suffix="px" />,
    );
    const slider = getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '24');
    expect(slider).toHaveAttribute('aria-valuenow', '12');
    expect(slider).toHaveAttribute('aria-valuetext', '12 px');
  });

  it('should call onChange with value only (no name) — matches CounterInput', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <SliderInput label="Test" value={50} name="mySlider" onChange={onChange} step={1} />,
    );
    const slider = getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith({ value: 51 });
  });

  it('should work as uncontrolled component', () => {
    const { getByRole } = renderWithTheme(
      <SliderInput label="Test" defaultValue={25} min={0} max={100} step={1} />,
    );
    expect(getByRole('slider')).toHaveAttribute('aria-valuenow', '25');
  });

  it('should snap to step values', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <SliderInput label="Test" value={10} onChange={onChange} min={0} max={100} step={5} />,
    );
    const slider = getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith({ value: 15 });
  });

  it('should call onChangeStart on keydown and onChangeEnd on keyup', () => {
    const onChangeStart = jest.fn();
    const onChangeEnd = jest.fn();
    const { getByRole } = renderWithTheme(
      <SliderInput
        label="Test"
        defaultValue={50}
        onChangeStart={onChangeStart}
        onChangeEnd={onChangeEnd}
        min={0}
        max={100}
        step={1}
      />,
    );
    const slider = getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChangeStart).toHaveBeenCalledWith({ value: 50 });
    expect(onChangeEnd).not.toHaveBeenCalled();
    fireEvent.keyUp(slider, { key: 'ArrowRight' });
    expect(onChangeEnd).toHaveBeenCalledWith({ value: 51 });
  });

  it('should not call onChangeStart again while a key is held down', () => {
    const onChangeStart = jest.fn();
    const { getByRole } = renderWithTheme(
      <SliderInput
        label="Test"
        defaultValue={50}
        onChangeStart={onChangeStart}
        min={0}
        max={100}
        step={1}
      />,
    );
    const slider = getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChangeStart).toHaveBeenCalledTimes(1);
  });
});
