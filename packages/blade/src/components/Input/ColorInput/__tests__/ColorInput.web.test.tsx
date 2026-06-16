import React from 'react';
import { ColorInput } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { fireEvent } from '@testing-library/react';

describe('<ColorInput />', () => {
  it('should render with default value', () => {
    const { getByDisplayValue } = renderWithTheme(
      <ColorInput label="Color" defaultValue={{ hex: 'FF5733', opacity: 80 }} />,
    );
    expect(getByDisplayValue('FF5733')).toBeInTheDocument();
    expect(getByDisplayValue('80')).toBeInTheDocument();
  });

  it('should render without opacity when showOpacity is false', () => {
    const { getByDisplayValue, queryByDisplayValue } = renderWithTheme(
      <ColorInput
        label="Color"
        defaultValue={{ hex: 'AABBCC', opacity: 100 }}
        showOpacity={false}
      />,
    );
    expect(getByDisplayValue('AABBCC')).toBeInTheDocument();
    expect(queryByDisplayValue('100')).not.toBeInTheDocument();
  });

  it('should accept valid hex characters and uppercase them', () => {
    const onChange = jest.fn();
    const { getByDisplayValue } = renderWithTheme(
      <ColorInput label="Color" value={{ hex: 'FFFFFF', opacity: 100 }} onChange={onChange} />,
    );
    const hexInput = getByDisplayValue('FFFFFF');
    fireEvent.change(hexInput, { target: { value: 'abc123' } });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ hex: 'ABC123', opacity: 100 }));
  });

  it('should reject invalid hex characters', () => {
    const onChange = jest.fn();
    const { getByDisplayValue } = renderWithTheme(
      <ColorInput label="Color" value={{ hex: 'FFFFFF', opacity: 100 }} onChange={onChange} />,
    );
    const hexInput = getByDisplayValue('FFFFFF');
    fireEvent.change(hexInput, { target: { value: 'ZZZZZZ' } });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should handle opacity input changes', () => {
    const onChange = jest.fn();
    const { getByDisplayValue } = renderWithTheme(
      <ColorInput label="Color" value={{ hex: 'FF0000', opacity: 100 }} onChange={onChange} />,
    );
    const opacityInput = getByDisplayValue('100');
    fireEvent.change(opacityInput, { target: { value: '50' } });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ hex: 'FF0000', opacity: 50 }));
  });

  it('should reject opacity values over 100', () => {
    const onChange = jest.fn();
    const { getByDisplayValue } = renderWithTheme(
      <ColorInput label="Color" value={{ hex: 'FF0000', opacity: 100 }} onChange={onChange} />,
    );
    const opacityInput = getByDisplayValue('100');
    fireEvent.change(opacityInput, { target: { value: '150' } });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should render in disabled state', () => {
    const { getByDisplayValue } = renderWithTheme(
      <ColorInput label="Color" defaultValue={{ hex: 'FFFFFF', opacity: 100 }} isDisabled />,
    );
    expect(getByDisplayValue('FFFFFF')).toBeDisabled();
    expect(getByDisplayValue('100')).toBeDisabled();
  });

  it('should render error validation state', () => {
    const { getByText } = renderWithTheme(
      <ColorInput
        label="Color"
        defaultValue={{ hex: 'FFFFFF', opacity: 100 }}
        validationState="error"
        errorText="Invalid color"
      />,
    );
    expect(getByText('Invalid color')).toBeInTheDocument();
  });

  it('should render success validation state', () => {
    const { getByText } = renderWithTheme(
      <ColorInput
        label="Color"
        defaultValue={{ hex: 'FFFFFF', opacity: 100 }}
        validationState="success"
        successText="Color saved"
      />,
    );
    expect(getByText('Color saved')).toBeInTheDocument();
  });

  it('should render help text', () => {
    const { getByText } = renderWithTheme(
      <ColorInput
        label="Color"
        defaultValue={{ hex: 'FFFFFF', opacity: 100 }}
        helpText="Enter a 6-digit hex code"
      />,
    );
    expect(getByText('Enter a 6-digit hex code')).toBeInTheDocument();
  });

  it('should work with accessibilityLabel instead of label', () => {
    const { container } = renderWithTheme(
      <ColorInput
        accessibilityLabel="Background color"
        defaultValue={{ hex: '000000', opacity: 100 }}
      />,
    );
    expect(container).toBeInTheDocument();
  });

  it('should have hidden native color input', () => {
    const { container } = renderWithTheme(
      <ColorInput label="Color" defaultValue={{ hex: 'FF5733', opacity: 100 }} />,
    );
    const colorInput = container.querySelector('input[type="color"]');
    expect(colorInput).toBeInTheDocument();
    expect(colorInput).toHaveAttribute('aria-hidden', 'true');
    expect(colorInput).toHaveValue('#ff5733');
  });

  it('should update hex value when native color picker changes', () => {
    const onChange = jest.fn();
    const { container } = renderWithTheme(
      <ColorInput label="Color" value={{ hex: 'FFFFFF', opacity: 100 }} onChange={onChange} />,
    );
    const colorInput = container.querySelector('input[type="color"]') as HTMLInputElement;
    fireEvent.change(colorInput, { target: { value: '#00FF00' } });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ hex: '00FF00', opacity: 100 }));
  });

  it('should open color picker when clicking the hex input area', () => {
    const { getByDisplayValue, container } = renderWithTheme(
      <ColorInput label="Color" defaultValue={{ hex: 'FF5733', opacity: 100 }} />,
    );
    const hexInput = getByDisplayValue('FF5733');
    const colorPicker = container.querySelector('input[type="color"]') as HTMLInputElement;
    const clickSpy = jest.spyOn(colorPicker, 'click');
    fireEvent.click(hexInput);
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it('should increment opacity with ArrowUp key', () => {
    const onChange = jest.fn();
    const { getByDisplayValue } = renderWithTheme(
      <ColorInput label="Color" value={{ hex: 'FF0000', opacity: 50 }} onChange={onChange} />,
    );
    const opacityInput = getByDisplayValue('50');
    fireEvent.keyDown(opacityInput, { key: 'ArrowUp' });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ hex: 'FF0000', opacity: 51 }));
  });

  it('should decrement opacity with ArrowDown key', () => {
    const onChange = jest.fn();
    const { getByDisplayValue } = renderWithTheme(
      <ColorInput label="Color" value={{ hex: 'FF0000', opacity: 50 }} onChange={onChange} />,
    );
    const opacityInput = getByDisplayValue('50');
    fireEvent.keyDown(opacityInput, { key: 'ArrowDown' });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ hex: 'FF0000', opacity: 49 }));
  });

  it('should not go below 0% with ArrowDown', () => {
    const onChange = jest.fn();
    const { getByDisplayValue } = renderWithTheme(
      <ColorInput label="Color" value={{ hex: 'FF0000', opacity: 0 }} onChange={onChange} />,
    );
    const opacityInput = getByDisplayValue('0');
    fireEvent.keyDown(opacityInput, { key: 'ArrowDown' });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should not go above 100% with ArrowUp', () => {
    const onChange = jest.fn();
    const { getByDisplayValue } = renderWithTheme(
      <ColorInput label="Color" value={{ hex: 'FF0000', opacity: 100 }} onChange={onChange} />,
    );
    const opacityInput = getByDisplayValue('100');
    fireEvent.keyDown(opacityInput, { key: 'ArrowUp' });
    expect(onChange).not.toHaveBeenCalled();
  });
});
