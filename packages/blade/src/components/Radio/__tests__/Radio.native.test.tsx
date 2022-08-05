/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { fireEvent } from '@testing-library/react-native';
import React from 'react';
import { Radio } from '../Radio';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<Radio />', () => {
  it('should render radio with label', () => {
    const labelText = 'Remember password';
    const { toJSON, getByText } = renderWithTheme(<Radio>{labelText}</Radio>);
    expect(toJSON()).toMatchSnapshot();
    expect(getByText(labelText)).toBeDefined();
  });

  it('should render helpText', () => {
    const labelText = 'Remember password';
    const helpText = 'This has to be checked';
    const { getByText } = renderWithTheme(<Radio helpText={helpText}>{labelText}</Radio>);
    expect(getByText(helpText)).toBeDefined();
  });

  it('should set disabled state with isDisabled', () => {
    const labelText = 'Remember password';
    const { toJSON, queryByA11yState } = renderWithTheme(<Radio isDisabled>{labelText}</Radio>);
    expect(toJSON()).toMatchSnapshot();
    const radio = queryByA11yState({ disabled: true });
    expect(radio).toBeTruthy();
    expect(radio?.props?.accessibilityState).toStrictEqual({ checked: false, disabled: true });
  });

  test('user should be able to set checked state', () => {
    const labelText = 'Remember password';
    const { getByRole } = renderWithTheme(<Radio>{labelText}</Radio>);
    const radio = getByRole('radio');

    expect(radio.props.accessibilityState.checked).toBeFalsy();
    fireEvent.press(radio);
    expect(radio.props.accessibilityState.checked).toBeTruthy();
    fireEvent.press(radio);
    expect(radio.props.accessibilityState.checked).toBeTruthy();
  });
});
