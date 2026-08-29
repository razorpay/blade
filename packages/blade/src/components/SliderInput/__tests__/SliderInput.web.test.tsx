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

  it('should render help text exactly once (no duplicate hint from the inner TextInput)', () => {
    const { getAllByText } = renderWithTheme(
      <SliderInput label="Test" value={50} onChange={jest.fn()} helpText="Some guidance" />,
    );
    expect(getAllByText('Some guidance')).toHaveLength(1);
  });

  it('should render the unit suffix inside the numeric input box', () => {
    const { getByText, getByRole } = renderWithTheme(
      <SliderInput label="Radius" value={12} onChange={jest.fn()} min={0} max={24} suffix="px" />,
    );
    const input = getByRole('textbox');
    const suffixEl = getByText('px');
    // The suffix must live inside the Blade TextInput's container, not floating outside it.
    expect(input.closest('[data-blade-component="textinput"]')).toContainElement(suffixEl);
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

  it('should call onChange with both name and value', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <SliderInput label="Test" value={50} name="mySlider" onChange={onChange} step={1} />,
    );
    const slider = getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith({ name: 'mySlider', value: 51 });
  });

  it('should clamp an unset initial value up to min (not start at 0)', () => {
    const { getByRole } = renderWithTheme(<SliderInput label="Test" min={10} max={20} />);
    expect(getByRole('slider')).toHaveAttribute('aria-valuenow', '10');
    expect(getByRole('textbox')).toHaveValue('10');
  });

  it('should clamp an out-of-range defaultValue into [min, max]', () => {
    const { getByRole } = renderWithTheme(
      <SliderInput label="Test" defaultValue={500} min={0} max={100} />,
    );
    expect(getByRole('slider')).toHaveAttribute('aria-valuenow', '100');
  });

  it('should work as uncontrolled component', () => {
    const { getByRole } = renderWithTheme(
      <SliderInput label="Test" defaultValue={25} min={0} max={100} step={1} />,
    );
    expect(getByRole('slider')).toHaveAttribute('aria-valuenow', '25');
  });

  it('should jump by step * 10 on Shift+Arrow (large step)', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <SliderInput label="Test" value={50} onChange={onChange} min={0} max={100} step={1} />,
    );
    fireEvent.keyDown(getByRole('slider'), { key: 'ArrowRight', shiftKey: true });
    expect(onChange).toHaveBeenCalledWith({ name: undefined, value: 60 });
  });

  it('should keep max reachable when the range is not a multiple of step', () => {
    const { getByRole } = renderWithTheme(
      <SliderInput label="Test" defaultValue={6} min={0} max={10} step={3} />,
    );
    const slider = getByRole('slider');
    fireEvent.keyDown(slider, { key: 'End' });
    expect(slider).toHaveAttribute('aria-valuenow', '10');
  });

  it('should snap steps anchored at min, not at zero', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <SliderInput label="Test" defaultValue={1} min={1} max={9} step={2} onChange={onChange} />,
    );
    fireEvent.keyDown(getByRole('slider'), { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith({ name: undefined, value: 3 });
  });

  it('should not leak floating-point artifacts for fractional steps', () => {
    const { getByRole } = renderWithTheme(
      <SliderInput label="Test" defaultValue={0.2} min={0} max={1} step={0.1} />,
    );
    const slider = getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(slider).toHaveAttribute('aria-valuenow', '0.3');
    expect(getByRole('textbox')).toHaveValue('0.3');
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

  it('should not crash or produce NaN when step is 0', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <SliderInput label="Test" value={50} onChange={onChange} min={0} max={100} step={0} />,
    );
    const slider = getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith({ value: 51 });
  });

  it('should fire onChangeEnd and reset key-active state if focus leaves mid-keypress', () => {
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
    fireEvent.blur(slider);
    expect(onChangeEnd).toHaveBeenCalledWith({ value: 51 });

    fireEvent.focus(slider);
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChangeStart).toHaveBeenCalledTimes(2);
  });

  it('should not commit the numeric input value until blur', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <SliderInput label="Test" defaultValue={50} onChange={onChange} min={0} max={100} />,
    );
    const input = getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '75' } });
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith({ value: 75 });
  });

  it('should report the clamped value (not the raw typed value) to onBlur', () => {
    const onBlur = jest.fn();
    const { getByRole } = renderWithTheme(
      <SliderInput label="Test" defaultValue={12} onBlur={onBlur} min={0} max={24} />,
    );
    const input = getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '1000' } });
    fireEvent.blur(input);
    expect(onBlur).toHaveBeenCalledWith({ name: undefined, value: 24 });
  });

  it('should fire onChangeEnd when a value is committed via input blur', () => {
    const onChangeEnd = jest.fn();
    const { getByRole } = renderWithTheme(
      <SliderInput label="Test" defaultValue={12} onChangeEnd={onChangeEnd} min={0} max={24} />,
    );
    const input = getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '18' } });
    fireEvent.blur(input);
    expect(onChangeEnd).toHaveBeenCalledWith({ value: 18 });
  });

  it('should commit the typed value on Enter and move the slider to it', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <SliderInput label="Test" defaultValue={50} onChange={onChange} min={0} max={100} />,
    );
    const input = getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '75' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith({ name: undefined, value: 75 });
    expect(getByRole('slider')).toHaveAttribute('aria-valuenow', '75');
  });

  it('should snap to max when a value above max is committed via Enter', () => {
    const { getByRole } = renderWithTheme(
      <SliderInput label="Test" defaultValue={12} min={0} max={24} />,
    );
    const input = getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '26' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(getByRole('slider')).toHaveAttribute('aria-valuenow', '24');
    expect(input).toHaveValue('24');
  });

  it('should set the name attribute on the numeric input for native form submission', () => {
    const { getByRole } = renderWithTheme(
      <SliderInput label="Test" defaultValue={50} name="radius" min={0} max={100} />,
    );
    expect(getByRole('textbox')).toHaveAttribute('name', 'radius');
  });
});
