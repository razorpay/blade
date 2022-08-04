/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { fireEvent } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
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

  it('should set error state with validationState', () => {
    const labelText = 'Remember password';
    const { toJSON, getByRole } = renderWithTheme(
      <Radio validationState="error">{labelText}</Radio>,
    );
    expect(toJSON()).toMatchSnapshot();

    const radio = getByRole('radio');
    expect(radio.findByProps({ accessibilityInvalid: true })).toBeTruthy();
  });

  it('should set disabled state with isDisabled', () => {
    const labelText = 'Remember password';
    const { toJSON, queryByA11yState } = renderWithTheme(<Radio isDisabled>{labelText}</Radio>);
    expect(toJSON()).toMatchSnapshot();
    const radio = queryByA11yState({ disabled: true });
    expect(radio).toBeTruthy();
    expect(radio?.props?.accessibilityState).toStrictEqual({ checked: false, disabled: true });
  });

  it('should set defaultChecked', () => {
    const labelText = 'Remember password';
    const { getByRole } = renderWithTheme(<Radio defaultChecked>{labelText}</Radio>);
    const radio = getByRole('radio');
    expect(radio.props.accessibilityState.checked).toBeTruthy();
  });

  it('should support isChecked prop', () => {
    const labelText = 'Remember password';
    const { getByRole } = renderWithTheme(<Radio isChecked>{labelText}</Radio>);
    const radio = getByRole('radio');

    expect(radio.props.accessibilityState.checked).toBeTruthy();
    // should not toggle
    fireEvent.press(radio);
    expect(radio.props.accessibilityState.checked).toBeTruthy();
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

  it('should support uncontrolled state', () => {
    const checkFn = jest.fn();
    const eventData = {
      nativeEvent: {
        pageX: 20,
        pageY: 30,
      },
    };
    const labelText = 'Remember password';
    const { getByRole } = renderWithTheme(
      <Radio defaultChecked={true} onChange={checkFn}>
        {labelText}
      </Radio>,
    );
    const radio = getByRole('radio');

    expect(radio.props.accessibilityState.checked).toBeTruthy();
    expect(checkFn).not.toBeCalled();
    fireEvent.press(radio, eventData);
    expect(radio.props.accessibilityState.checked).toBeTruthy();
  });

  it('should support controlled state', () => {
    const labelText = 'Remember password';
    const Example = () => {
      const [checked, setChecked] = React.useState(false);
      return (
        <>
          <Radio isChecked={checked} onChange={({ isChecked }) => setChecked(isChecked)}>
            {labelText}
          </Radio>
          <Text testID="state">{checked ? 'checked' : 'unchecked'}</Text>
        </>
      );
    };
    const { getByTestId, getByRole } = renderWithTheme(<Example />);
    const radio = getByRole('radio');

    expect(getByTestId('state').children[0]).toBe('unchecked');
    fireEvent.press(radio);
    expect(getByTestId('state').children[0]).toBe('checked');
    fireEvent.press(radio);
    expect(getByTestId('state').children[0]).toBe('checked');
  });
});
