import React from 'react';
import { act, fireEvent } from '@testing-library/react-native';
import { ColorInput } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ColorInput />', () => {
  it('should render with default value', () => {
    const { getByPlaceholderText } = renderWithTheme(
      <ColorInput label="Color" defaultValue={{ hex: '#FF5733', opacity: 80 }} />,
    );
    expect(getByPlaceholderText('000000')).toBeTruthy();
    expect(getByPlaceholderText('100')).toBeTruthy();
  });

  it('should render without opacity input when showOpacity is false', () => {
    const { getByPlaceholderText, queryByPlaceholderText } = renderWithTheme(
      <ColorInput
        label="Color"
        defaultValue={{ hex: '#AABBCC', opacity: 100 }}
        showOpacity={false}
      />,
    );
    expect(getByPlaceholderText('000000')).toBeTruthy();
    expect(queryByPlaceholderText('100')).toBeNull();
  });

  it('should accept valid 6-char hex input and call onChange', () => {
    const onChange = jest.fn();
    const { getByPlaceholderText } = renderWithTheme(
      <ColorInput label="Color" value={{ hex: '#FFFFFF', opacity: 100 }} onChange={onChange} />,
    );
    const hexInput = getByPlaceholderText('000000');
    fireEvent.changeText(hexInput, 'abc123');
    expect(onChange).toHaveBeenCalledWith({
      name: undefined,
      value: { hex: '#ABC123', opacity: 100 },
    });
  });

  it('should reject invalid hex characters and not call onChange', () => {
    const onChange = jest.fn();
    const { getByPlaceholderText } = renderWithTheme(
      <ColorInput label="Color" value={{ hex: '#FFFFFF', opacity: 100 }} onChange={onChange} />,
    );
    const hexInput = getByPlaceholderText('000000');
    fireEvent.changeText(hexInput, 'ZZZZZZ');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should handle opacity input changes', () => {
    const onChange = jest.fn();
    const { getByPlaceholderText } = renderWithTheme(
      <ColorInput label="Color" value={{ hex: '#FF0000', opacity: 100 }} onChange={onChange} />,
    );
    const opacityInput = getByPlaceholderText('100');
    fireEvent.changeText(opacityInput, '50');
    expect(onChange).toHaveBeenCalledWith({
      name: undefined,
      value: { hex: '#FF0000', opacity: 50 },
    });
  });

  it('should reject opacity values over 100 and not call onChange', () => {
    const onChange = jest.fn();
    const { getByPlaceholderText } = renderWithTheme(
      <ColorInput label="Color" value={{ hex: '#FF0000', opacity: 100 }} onChange={onChange} />,
    );
    const opacityInput = getByPlaceholderText('100');
    fireEvent.changeText(opacityInput, '150');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should restore opacity to last valid value on blur with invalid input', () => {
    const { getByPlaceholderText } = renderWithTheme(
      <ColorInput label="Color" defaultValue={{ hex: '#FFFFFF', opacity: 75 }} />,
    );
    const opacityInput = getByPlaceholderText('100');
    fireEvent.changeText(opacityInput, '');
    fireEvent(opacityInput, 'onEndEditing', { nativeEvent: { text: '' } });
    expect(opacityInput).toHaveProp('value', '75');
  });

  it('should render in disabled state', () => {
    const { getByPlaceholderText } = renderWithTheme(
      <ColorInput label="Color" defaultValue={{ hex: '#FFFFFF', opacity: 100 }} isDisabled />,
    );
    expect(getByPlaceholderText('000000')).toBeDisabled();
    expect(getByPlaceholderText('100')).toBeDisabled();
  });

  it('should call onFocus with full ColorInputValue when hex input is focused', () => {
    const onFocus = jest.fn();
    const { getByPlaceholderText } = renderWithTheme(
      <ColorInput label="Color" defaultValue={{ hex: '#FF5733', opacity: 80 }} onFocus={onFocus} />,
    );
    const hexInput = getByPlaceholderText('000000');
    fireEvent(hexInput, 'focus', { nativeEvent: { text: 'FF5733' } });
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onFocus).toHaveBeenCalledWith({
      name: undefined,
      value: { hex: '#FF5733', opacity: 80 },
    });
  });

  it('should call onBlur with full ColorInputValue when hex input loses focus', () => {
    jest.useFakeTimers();
    const onBlur = jest.fn();
    const { getByPlaceholderText } = renderWithTheme(
      <ColorInput label="Color" defaultValue={{ hex: '#FF5733', opacity: 80 }} onBlur={onBlur} />,
    );
    const hexInput = getByPlaceholderText('000000');
    fireEvent(hexInput, 'focus', { nativeEvent: { text: 'FF5733' } });
    fireEvent(hexInput, 'onEndEditing', { nativeEvent: { text: 'FF5733' } });
    void act(() => {
      jest.runAllTimers();
    });
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledWith({
      name: undefined,
      value: { hex: '#FF5733', opacity: 80 },
    });
    jest.useRealTimers();
  });

  it('should fire onFocus only once when focus moves between hex and opacity inputs', () => {
    jest.useFakeTimers();
    const onFocus = jest.fn();
    const { getByPlaceholderText } = renderWithTheme(
      <ColorInput
        label="Color"
        defaultValue={{ hex: '#FFFFFF', opacity: 100 }}
        onFocus={onFocus}
      />,
    );
    const hexInput = getByPlaceholderText('000000');
    const opacityInput = getByPlaceholderText('100');

    // Focus hex input → onFocus fires
    fireEvent(hexInput, 'focus', { nativeEvent: { text: 'FFFFFF' } });
    expect(onFocus).toHaveBeenCalledTimes(1);

    // Blur hex, then focus opacity — the blur timeout is cleared before firing
    fireEvent(hexInput, 'onEndEditing', { nativeEvent: { text: 'FFFFFF' } });
    fireEvent(opacityInput, 'focus', { nativeEvent: { text: '100' } });
    void act(() => {
      jest.runAllTimers();
    });

    // onFocus should still be called only once (composite boundary)
    expect(onFocus).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it('should fire onBlur only once when focus leaves the composite widget', () => {
    jest.useFakeTimers();
    const onBlur = jest.fn();
    const { getByPlaceholderText } = renderWithTheme(
      <ColorInput label="Color" defaultValue={{ hex: '#FFFFFF', opacity: 100 }} onBlur={onBlur} />,
    );
    const hexInput = getByPlaceholderText('000000');
    const opacityInput = getByPlaceholderText('100');

    // Focus hex, move to opacity (no blur fires yet)
    fireEvent(hexInput, 'focus', { nativeEvent: { text: 'FFFFFF' } });
    fireEvent(hexInput, 'onEndEditing', { nativeEvent: { text: 'FFFFFF' } });
    fireEvent(opacityInput, 'focus', { nativeEvent: { text: '100' } });
    void act(() => {
      jest.runAllTimers();
    });
    expect(onBlur).toHaveBeenCalledTimes(0);

    // Now blur opacity (leave composite entirely)
    fireEvent(opacityInput, 'onEndEditing', { nativeEvent: { text: '100' } });
    void act(() => {
      jest.runAllTimers();
    });
    expect(onBlur).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });
});
