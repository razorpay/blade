/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { fireEvent } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import { Radio } from '../Radio';
import { RadioGroup } from '../RadioGroup/RadioGroup';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<RadioGroup />', () => {
  it('should render with label', () => {
    const labelText = 'Select fav fruit';
    const { toJSON, queryByText } = renderWithTheme(
      <RadioGroup label={labelText}>
        <Radio value="apple">Apple</Radio>
        <Radio value="mango">Mango</Radio>
        <Radio value="orange">Orange</Radio>
      </RadioGroup>,
    );
    expect(toJSON()).toMatchSnapshot();
    expect(queryByText(labelText)).toBeTruthy();
  });

  it('should render with help text', () => {
    const labelText = 'Select fruits';
    const helpText = 'Select one';
    const { toJSON, queryByText } = renderWithTheme(
      <RadioGroup helpText={helpText} label={labelText}>
        <Radio value="apple">Apple</Radio>
        <Radio value="mango">Mango</Radio>
        <Radio value="orange">Orange</Radio>
      </RadioGroup>,
    );
    expect(toJSON()).toMatchSnapshot();
    expect(queryByText(labelText)).toBeTruthy();
    expect(queryByText(helpText)).toBeTruthy();
  });

  it('should propagate isDisabled prop to child radios', () => {
    const labelText = 'Select fruits';
    const { getAllByA11yRole } = renderWithTheme(
      <RadioGroup isDisabled label={labelText}>
        <Radio value="apple">Apple</Radio>
        <Radio value="mango">Mango</Radio>
        <Radio value="orange">Orange</Radio>
      </RadioGroup>,
    );

    const radios = getAllByA11yRole('radio');
    radios.forEach((radio) => {
      expect(radio.props.accessibilityState.disabled).toBeTruthy();
    });
  });

  it('should propagate name prop to child radios', () => {
    const labelText = 'Select fruits';
    const { getAllByA11yRole } = renderWithTheme(
      <RadioGroup isDisabled label={labelText} name="fruits">
        <Radio value="apple">Apple</Radio>
        <Radio value="mango">Mango</Radio>
        <Radio value="orange">Orange</Radio>
      </RadioGroup>,
    );

    const radios = getAllByA11yRole('radio');
    radios.forEach((radio) => {
      expect(radio.props.name).toBe('fruits');
    });
  });

  it('should render helpText of individual radios when inside group', () => {
    const labelText = 'Select fruits';
    const helpText = 'Select one';

    const { queryByText } = renderWithTheme(
      <RadioGroup helpText={helpText} label={labelText}>
        <Radio helpText="Apple help" value="apple">
          Apple
        </Radio>
        <Radio helpText="Mango help" value="mango">
          Mango
        </Radio>
      </RadioGroup>,
    );

    expect(queryByText(helpText)).toBeTruthy();
    expect(queryByText('Apple help')).toBeTruthy();
    expect(queryByText('Mango help')).toBeTruthy();
  });

  it('should render errorText when validationState is set to error', () => {
    const labelText = 'Select fruits';
    const helpText = 'Select one';
    const errorText = 'Invalid selection';

    const { getAllByA11yRole, queryByText } = renderWithTheme(
      <RadioGroup
        helpText={helpText}
        errorText={errorText}
        label={labelText}
        validationState="error"
      >
        <Radio value="apple">Apple</Radio>
        <Radio value="mango">Mango</Radio>
        <Radio value="orange">Orange</Radio>
      </RadioGroup>,
    );

    expect(queryByText(helpText)).toBeFalsy();
    expect(queryByText(errorText)).toBeTruthy();

    const radios = getAllByA11yRole('radio');
    radios.forEach((radio) => {
      expect(radio.props.accessibilityInvalid).toBeTruthy();
    });
  });

  it('should work in uncontrolled mode', () => {
    const labelText = 'Select fruits';
    const onChange = jest.fn();
    const { getByA11yState, getAllByA11yRole } = renderWithTheme(
      <RadioGroup name="fruits" label={labelText} defaultValue="apple" onChange={onChange}>
        <Radio value="apple">Apple</Radio>
        <Radio value="mango">Mango</Radio>
        <Radio value="orange">Orange</Radio>
      </RadioGroup>,
    );

    const radio = getByA11yState({ checked: true });
    expect(radio.props.value).toBe('apple');

    const radios = getAllByA11yRole('radio');
    const apple = radios.find((radio) => radio.props.value === 'apple');
    const mango = radios.find((radio) => radio.props.value === 'mango');
    const orange = radios.find((radio) => radio.props.value === 'orange');

    expect(apple?.props.accessibilityState.checked).toBeTruthy();
    expect(onChange).not.toBeCalled();
    fireEvent.press(mango!);
    expect(mango?.props.accessibilityState.checked).toBeTruthy();
    expect(onChange).toBeCalledWith({ value: 'mango', name: 'fruits' });
    fireEvent.press(orange!);
    expect(orange?.props.accessibilityState.checked).toBeTruthy();
    expect(onChange).toBeCalledWith({ value: 'orange', name: 'fruits' });
    fireEvent.press(apple!);
    expect(apple?.props.accessibilityState.checked).toBeTruthy();
    expect(onChange).toBeCalledWith({ value: 'apple', name: 'fruits' });
  });

  it('should work in controlled mode', () => {
    const labelText = 'Select fruits';
    const onChange = jest.fn();
    const Example = () => {
      const [value, setValue] = React.useState('apple');
      return (
        <>
          <RadioGroup
            label={labelText}
            value={value}
            onChange={({ value }) => {
              setValue(value);
              onChange(value);
            }}
          >
            <Radio value="apple">Apple</Radio>
            <Radio value="mango">Mango</Radio>
            <Radio value="orange">Orange</Radio>
          </RadioGroup>
          <Text testID="values">{value}</Text>
        </>
      );
    };
    const { getByA11yState, getAllByA11yRole, getByTestId } = renderWithTheme(<Example />);

    const radio = getByA11yState({ checked: true });
    expect(radio.props.value).toBe('apple');

    const radios = getAllByA11yRole('radio');
    const apple = radios.find((radio) => radio.props.value === 'apple');
    const mango = radios.find((radio) => radio.props.value === 'mango');
    const orange = radios.find((radio) => radio.props.value === 'orange');

    expect(apple?.props.accessibilityState.checked).toBeTruthy();
    expect(onChange).not.toBeCalled();
    fireEvent.press(mango!);
    expect(mango?.props.accessibilityState.checked).toBeTruthy();
    expect(onChange).toBeCalledWith('mango');
    fireEvent.press(orange!);
    expect(orange?.props.accessibilityState.checked).toBeTruthy();
    expect(onChange).toBeCalledWith('orange');
    fireEvent.press(apple!);
    expect(apple?.props.accessibilityState.checked).toBeTruthy();
    expect(onChange).toBeCalledWith('apple');
    expect(getByTestId('values').children[0]).toBe('apple');
  });

  it('should accept testID', () => {
    const labelText = 'Select fruit';
    const { getByTestId } = renderWithTheme(
      <RadioGroup label={labelText} testID="radio-group-test">
        <Radio value="apple">Apple</Radio>
      </RadioGroup>,
    );
    expect(getByTestId('radio-group-test')).toBeTruthy();
  });
});
