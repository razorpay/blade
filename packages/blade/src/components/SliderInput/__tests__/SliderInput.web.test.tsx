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

  it('should render with value and suffix', () => {
    const { getByDisplayValue, getByText } = renderWithTheme(
      <SliderInput label="Radius" value={12} suffix="px" />,
    );
    expect(getByDisplayValue('12')).toBeTruthy();
    expect(getByText('px')).toBeTruthy();
  });

  it('should call onChange when value changes via keyboard', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <SliderInput label="Test" value={50} onChange={onChange} min={0} max={100} step={1} />,
    );
    const slider = getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith({ name: undefined, value: 51 });
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
    expect(onChange).toHaveBeenCalledWith({ name: undefined, value: 0 });
    fireEvent.keyDown(slider, { key: 'End' });
    expect(onChange).toHaveBeenCalledWith({ name: undefined, value: 100 });
  });

  it('should update value from input field on blur', () => {
    const onChange = jest.fn();
    const { getByDisplayValue } = renderWithTheme(
      <SliderInput label="Test" value={50} onChange={onChange} min={0} max={100} />,
    );
    const input = getByDisplayValue('50');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '75' } });
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith({ name: undefined, value: 75 });
  });

  it('should clamp input value to max on blur', () => {
    const onChange = jest.fn();
    const { getByDisplayValue } = renderWithTheme(
      <SliderInput label="Test" value={50} onChange={onChange} min={0} max={100} />,
    );
    const input = getByDisplayValue('50');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '200' } });
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith({ name: undefined, value: 100 });
  });

  it('should render in disabled state', () => {
    const { getByRole } = renderWithTheme(<SliderInput label="Test" value={50} isDisabled />);
    expect(getByRole('slider')).toHaveAttribute('aria-disabled', 'true');
  });

  it('should render error text when validationState is error', () => {
    const { getByText } = renderWithTheme(
      <SliderInput
        label="Test"
        value={50}
        validationState="error"
        errorText="Something went wrong"
      />,
    );
    expect(getByText('Something went wrong')).toBeTruthy();
  });

  it('should render help text', () => {
    const { getByText } = renderWithTheme(
      <SliderInput label="Test" value={50} helpText="Some guidance" />,
    );
    expect(getByText('Some guidance')).toBeTruthy();
  });

  it('should set correct ARIA attributes', () => {
    const { getByRole } = renderWithTheme(
      <SliderInput label="Radius" value={12} min={0} max={24} suffix="px" />,
    );
    const slider = getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '24');
    expect(slider).toHaveAttribute('aria-valuenow', '12');
    expect(slider).toHaveAttribute('aria-valuetext', '12 px');
  });

  it('should pass name to onChange', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <SliderInput label="Test" value={50} name="mySlider" onChange={onChange} step={1} />,
    );
    const slider = getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith({ name: 'mySlider', value: 51 });
  });

  it('should work as uncontrolled component', () => {
    const { getByRole, getByDisplayValue } = renderWithTheme(
      <SliderInput label="Test" defaultValue={25} min={0} max={100} step={1} />,
    );
    expect(getByRole('slider')).toHaveAttribute('aria-valuenow', '25');
    expect(getByDisplayValue('25')).toBeTruthy();
  });

  it('should snap to step values', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <SliderInput label="Test" value={10} onChange={onChange} min={0} max={100} step={5} />,
    );
    const slider = getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith({ name: undefined, value: 15 });
  });
});
