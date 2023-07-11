/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { fireEvent } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import { Switch } from '../Switch';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<Switch />', () => {
  it('should render switch with label', () => {
    const name = 'Toggle Darkmode';
    const { toJSON, getByRole } = renderWithTheme(<Switch accessibilityLabel={name} />);
    expect(toJSON()).toMatchSnapshot();
    expect(getByRole('switch')).toBeDefined();
  });

  it('should set disabled state with isDisabled', () => {
    const name = 'Toggle Darkmode';
    const { toJSON, queryByA11yState } = renderWithTheme(
      <Switch isDisabled accessibilityLabel={name} />,
    );
    expect(toJSON()).toMatchSnapshot();
    const switchElement = queryByA11yState({ disabled: true });
    expect(switchElement).toBeTruthy();
    expect(switchElement?.props?.accessibilityState).toStrictEqual({
      checked: false,
      disabled: true,
    });
  });

  it('should set defaultChecked', () => {
    const name = 'Toggle Darkmode';
    const { getByRole } = renderWithTheme(<Switch defaultChecked accessibilityLabel={name} />);
    const switchElement = getByRole('switch');
    expect(switchElement.props.accessibilityState.checked).toBeTruthy();
  });

  it('should support isChecked prop', () => {
    const name = 'Toggle Darkmode';
    const { getByRole } = renderWithTheme(<Switch isChecked accessibilityLabel={name} />);
    const switchElement = getByRole('switch');

    expect(switchElement.props.accessibilityState.checked).toBeTruthy();
    // should not toggle
    fireEvent.press(switchElement);
    expect(switchElement.props.accessibilityState.checked).toBeTruthy();
  });

  test('user should be able to toggle switch', () => {
    const name = 'Toggle Darkmode';
    const { getByRole } = renderWithTheme(<Switch accessibilityLabel={name} />);
    const switchElement = getByRole('switch');

    expect(switchElement.props.accessibilityState.checked).toBeFalsy();
    fireEvent.press(switchElement);
    expect(switchElement.props.accessibilityState.checked).toBeTruthy();
    fireEvent.press(switchElement);
    expect(switchElement.props.accessibilityState.checked).toBeFalsy();
  });

  it('should support uncontrolled state', () => {
    const checkFn = jest.fn();
    const eventData = {
      nativeEvent: {
        pageX: 20,
        pageY: 30,
      },
    };
    const name = 'Toggle Darkmode';
    const { getByRole } = renderWithTheme(
      <Switch defaultChecked={true} onChange={checkFn} accessibilityLabel={name} />,
    );
    const switchElement = getByRole('switch');

    expect(switchElement.props.accessibilityState.checked).toBeTruthy();
    expect(checkFn).not.toBeCalled();
    fireEvent.press(switchElement, eventData);
    expect(switchElement.props.accessibilityState.checked).toBeFalsy();
    expect(checkFn).toBeCalledWith(
      expect.objectContaining({
        isChecked: false,
        value: undefined,
        event: eventData,
      }),
    );
    fireEvent.press(switchElement, eventData);
    expect(switchElement.props.accessibilityState.checked).toBeTruthy();
    expect(checkFn).toBeCalledWith(
      expect.objectContaining({
        isChecked: true,
        value: undefined,
        event: eventData,
      }),
    );
  });

  it('should support controlled state', () => {
    const name = 'Toggle Darkmode';
    const Example = () => {
      const [checked, setChecked] = React.useState(false);
      return (
        <>
          <Switch
            isChecked={checked}
            onChange={({ isChecked }) => setChecked(isChecked)}
            accessibilityLabel={name}
          />
          <Text>{checked ? 'checked' : 'unchecked'}</Text>
        </>
      );
    };
    const { getByText, getByRole } = renderWithTheme(<Example />);
    const switchElement = getByRole('switch');

    expect(getByText('unchecked')).toBeTruthy();
    fireEvent.press(switchElement);
    expect(getByText('checked')).toBeTruthy();
    fireEvent.press(switchElement);
    expect(getByText('unchecked')).toBeTruthy();
  });

  it('should expose native element methods via ref', () => {
    let refValue = null;
    const Example = (): React.ReactElement => {
      const ref = React.useRef<HTMLInputElement>(null);
      return (
        <Switch
          accessibilityLabel="Toggle darkmode"
          ref={(value) => {
            console.log(value);
            // @ts-expect-error
            ref.current = value;
            refValue = value;
          }}
        />
      );
    };

    renderWithTheme(<Example />);
    expect(refValue).toBeNull();
  });

  it('should accept testID', () => {
    const name = 'Toggle Darkmode';
    const { getByTestId } = renderWithTheme(
      <Switch testID="switchElement-test" accessibilityLabel={name} />,
    );
    expect(getByTestId('switchElement-test')).toBeTruthy();
  });
});
