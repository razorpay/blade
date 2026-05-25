/* eslint-disable @typescript-eslint/ban-ts-comment */
import { fireEvent } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import React, { useState } from 'react';

import { ColorInput } from '..';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

const PLACEHOLDER = '#000000';

describe('<ColorInput />', () => {
  it('should render', () => {
    const { toJSON } = renderWithTheme(<ColorInput label="Brand Color" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render large size', () => {
    const { toJSON } = renderWithTheme(<ColorInput label="Brand Color" size="large" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should display success validation state', () => {
    const { getByText } = renderWithTheme(
      <ColorInput
        label="Brand Color"
        validationState="success"
        successText="Color applied"
        helpText="Help"
        errorText="Error"
      />,
    );
    getByText('Color applied');
  });

  it('should display error validation state', () => {
    const { getByText } = renderWithTheme(
      <ColorInput
        label="Brand Color"
        validationState="error"
        errorText="Invalid color"
        successText="Success"
        helpText="Help"
      />,
    );
    getByText('Invalid color');
  });

  it('should display help text', () => {
    const { getByText } = renderWithTheme(
      <ColorInput
        label="Brand Color"
        errorText="Error"
        helpText="Enter a hex color"
        successText="Success"
      />,
    );
    getByText('Enter a hex color');
  });

  it('should be disabled when isDisabled is passed', () => {
    const { getByPlaceholderText } = renderWithTheme(
      <ColorInput label="Brand Color" placeholder={PLACEHOLDER} isDisabled />,
    );
    const input = getByPlaceholderText(PLACEHOLDER);
    expect(input).toBeDisabled();
  });

  it('should handle onChange', () => {
    const onChange = jest.fn();
    const { getByPlaceholderText } = renderWithTheme(
      <ColorInput
        label="Brand Color"
        placeholder={PLACEHOLDER}
        name="brandColor"
        onChange={onChange}
      />,
    );

    const input = getByPlaceholderText(PLACEHOLDER);
    fireEvent.changeText(input, '#3366FF');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ name: 'brandColor', value: '#3366FF' });
  });

  it('should set value as a controlled input', () => {
    const ControlledInputExample = (): ReactElement => {
      const [value, setValue] = useState<string | undefined>('#336');
      return (
        <ColorInput
          label="Brand Color"
          placeholder={PLACEHOLDER}
          value={value}
          onChange={({ value }) => setValue(value as string)}
        />
      );
    };

    const { getByPlaceholderText } = renderWithTheme(<ControlledInputExample />);
    const input = getByPlaceholderText(PLACEHOLDER);
    expect(input.props.value).toBe('#336');
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <ColorInput label="Brand Color" testID="color-input-test" />,
    );
    expect(getByTestId('color-input-test')).toBeTruthy();
  });
});
