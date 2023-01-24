/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { fireEvent } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import { Checkbox } from '../Checkbox';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<Checkbox />', () => {
  it('should render checkbox with label', () => {
    const labelText = 'Remember password';
    const { toJSON, getByText } = renderWithTheme(<Checkbox>{labelText}</Checkbox>);
    expect(toJSON()).toMatchSnapshot();
    expect(getByText(labelText)).toBeDefined();
  });

  it('should render helpText', () => {
    const labelText = 'Remember password';
    const helpText = 'This has to be checked';
    const { getByText } = renderWithTheme(<Checkbox helpText={helpText}>{labelText}</Checkbox>);
    expect(getByText(helpText)).toBeDefined();
  });

  it('should set error state with validationState', () => {
    const labelText = 'Remember password';
    const errorText = 'This has to be checked';
    const { toJSON, getByRole, getByText } = renderWithTheme(
      <Checkbox validationState="error" errorText={errorText}>
        {labelText}
      </Checkbox>,
    );
    expect(toJSON()).toMatchSnapshot();

    const checkbox = getByRole('checkbox');
    expect(getByText(errorText)).toBeTruthy();
    expect(checkbox.findByProps({ accessibilityInvalid: true })).toBeTruthy();
  });

  it('should set disabled state with isDisabled', () => {
    const labelText = 'Remember password';
    const { toJSON, queryByA11yState } = renderWithTheme(
      <Checkbox isDisabled>{labelText}</Checkbox>,
    );
    expect(toJSON()).toMatchSnapshot();
    const checkbox = queryByA11yState({ disabled: true });
    expect(checkbox).toBeTruthy();
    expect(checkbox?.props?.accessibilityState).toStrictEqual({ checked: false, disabled: true });
  });

  it('should set defaultChecked', () => {
    const labelText = 'Remember password';
    const { getByRole } = renderWithTheme(<Checkbox defaultChecked>{labelText}</Checkbox>);
    const checkbox = getByRole('checkbox');
    expect(checkbox.props.accessibilityState.checked).toBeTruthy();
  });

  it('should support isChecked prop', () => {
    const labelText = 'Remember password';
    const { getByRole } = renderWithTheme(<Checkbox isChecked>{labelText}</Checkbox>);
    const checkbox = getByRole('checkbox');

    expect(checkbox.props.accessibilityState.checked).toBeTruthy();
    // should not toggle
    fireEvent.press(checkbox);
    expect(checkbox.props.accessibilityState.checked).toBeTruthy();
  });

  test('user should be able to toggle checkbox', () => {
    const labelText = 'Remember password';
    const { getByRole } = renderWithTheme(<Checkbox>{labelText}</Checkbox>);
    const checkbox = getByRole('checkbox');

    expect(checkbox.props.accessibilityState.checked).toBeFalsy();
    fireEvent.press(checkbox);
    expect(checkbox.props.accessibilityState.checked).toBeTruthy();
    fireEvent.press(checkbox);
    expect(checkbox.props.accessibilityState.checked).toBeFalsy();
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
      <Checkbox defaultChecked={true} onChange={checkFn}>
        {labelText}
      </Checkbox>,
    );
    const checkbox = getByRole('checkbox');

    expect(checkbox.props.accessibilityState.checked).toBeTruthy();
    expect(checkFn).not.toBeCalled();
    fireEvent.press(checkbox, eventData);
    expect(checkbox.props.accessibilityState.checked).toBeFalsy();
    expect(checkFn).toBeCalledWith(
      expect.objectContaining({
        isChecked: false,
        value: undefined,
        event: eventData,
      }),
    );
    fireEvent.press(checkbox, eventData);
    expect(checkbox.props.accessibilityState.checked).toBeTruthy();
    expect(checkFn).toBeCalledWith(
      expect.objectContaining({
        isChecked: true,
        value: undefined,
        event: eventData,
      }),
    );
  });

  it('should support controlled state', () => {
    const labelText = 'Remember password';
    const Example = () => {
      const [checked, setChecked] = React.useState(false);
      return (
        <>
          <Checkbox isChecked={checked} onChange={({ isChecked }) => setChecked(isChecked)}>
            {labelText}
          </Checkbox>
          <Text testID="state">{checked ? 'checked' : 'unchecked'}</Text>
        </>
      );
    };
    const { getByTestId, getByRole } = renderWithTheme(<Example />);
    const checkbox = getByRole('checkbox');

    expect(getByTestId('state').children[0]).toBe('unchecked');
    fireEvent.press(checkbox);
    expect(getByTestId('state').children[0]).toBe('checked');
    fireEvent.press(checkbox);
    expect(getByTestId('state').children[0]).toBe('unchecked');
  });

  it('should expose native element methods via ref', () => {
    let refValue = null;
    const Example = (): React.ReactElement => {
      const ref = React.useRef<HTMLInputElement>(null);
      return (
        <Checkbox
          ref={(value) => {
            console.log(value);
            // @ts-expect-error
            ref.current = value;
            refValue = value;
          }}
        >
          Agree
        </Checkbox>
      );
    };

    renderWithTheme(<Example />);
    expect(refValue).toBeNull();
  });
});
