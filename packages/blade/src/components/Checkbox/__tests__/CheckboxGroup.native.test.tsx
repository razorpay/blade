/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-implicit-any-catch */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { fireEvent } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import { Checkbox } from '../Checkbox';
import { CheckboxGroup } from '../CheckboxGroup';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<CheckboxGroup />', () => {
  it('should render with label', () => {
    const labelText = 'Select fruits';
    const { toJSON, queryByText } = renderWithTheme(
      <CheckboxGroup label={labelText}>
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="mango">Mango</Checkbox>
        <Checkbox value="orange">Orange</Checkbox>
      </CheckboxGroup>,
    );
    expect(toJSON()).toMatchSnapshot();
    expect(queryByText(labelText)).toBeTruthy();
  });

  it('should render with label', () => {
    const labelText = 'Select fruits';
    const helpText = 'Select one';
    const { toJSON, queryByText } = renderWithTheme(
      <CheckboxGroup helpText={helpText} label={labelText}>
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="mango">Mango</Checkbox>
        <Checkbox value="orange">Orange</Checkbox>
      </CheckboxGroup>,
    );
    expect(toJSON()).toMatchSnapshot();
    expect(queryByText(labelText)).toBeTruthy();
    expect(queryByText(helpText)).toBeTruthy();
  });

  it('should propagate isDisabled prop to child checkboxes', () => {
    const labelText = 'Select fruits';
    const { getAllByA11yRole } = renderWithTheme(
      <CheckboxGroup isDisabled label={labelText}>
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="mango">Mango</Checkbox>
        <Checkbox value="orange">Orange</Checkbox>
      </CheckboxGroup>,
    );
    const checkboxes = getAllByA11yRole('checkbox');
    checkboxes.forEach((checkbox) => {
      expect(checkbox.props.accessibilityState.disabled).toBeTruthy();
    });
  });

  it('should propagate name prop to child checkboxes', () => {
    const labelText = 'Select fruits';
    const { getAllByA11yRole } = renderWithTheme(
      <CheckboxGroup isDisabled label={labelText} name="fruits">
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="mango">Mango</Checkbox>
        <Checkbox value="orange">Orange</Checkbox>
      </CheckboxGroup>,
    );

    const checkboxes = getAllByA11yRole('checkbox');
    checkboxes.forEach((checkbox) => {
      expect(checkbox.props.name).toBe('fruits');
    });
  });

  it('should render errorText when hasError is set to true', () => {
    const labelText = 'Select fruits';
    const helpText = 'Select one';
    const errorText = 'Invalid selection';

    const { getAllByA11yRole, queryByText } = renderWithTheme(
      <CheckboxGroup
        helpText={helpText}
        errorText={errorText}
        label={labelText}
        validationState="error"
      >
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="mango">Mango</Checkbox>
        <Checkbox value="orange">Orange</Checkbox>
      </CheckboxGroup>,
    );

    expect(queryByText(helpText)).toBeFalsy();
    expect(queryByText(errorText)).toBeTruthy();

    const checkboxes = getAllByA11yRole('checkbox');
    checkboxes.forEach((checkbox) => {
      expect(checkbox.props.accessibilityInvalid).toBeTruthy();
    });
  });

  it('should work in uncontrolled mode', () => {
    const labelText = 'Select fruits';
    const fn = jest.fn();
    const { getAllByA11yRole, getByA11yState } = renderWithTheme(
      <CheckboxGroup label={labelText} defaultValue={['apple']} onChange={(values) => fn(values)}>
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="mango">Mango</Checkbox>
        <Checkbox value="orange">Orange</Checkbox>
      </CheckboxGroup>,
    );

    const checkbox = getByA11yState({ checked: true });
    expect(checkbox.props.value).toBe('apple');

    const checkboxes = getAllByA11yRole('checkbox');
    const apple = checkboxes.find((checkbox) => checkbox.props.value === 'apple');
    const mango = checkboxes.find((checkbox) => checkbox.props.value === 'mango');
    const orange = checkboxes.find((checkbox) => checkbox.props.value === 'orange');

    expect(apple?.props.accessibilityState.checked).toBeTruthy();
    expect(fn).not.toBeCalled();
    fireEvent.press(mango!);
    expect(mango?.props.accessibilityState.checked).toBeTruthy();
    expect(fn).toBeCalledWith(['apple', 'mango']);
    fireEvent.press(orange!);
    expect(orange?.props.accessibilityState.checked).toBeTruthy();
    expect(fn).toBeCalledWith(['apple', 'mango', 'orange']);
    fireEvent.press(apple!);
    expect(apple?.props.accessibilityState.checked).toBeFalsy();
    expect(fn).toBeCalledWith(['mango', 'orange']);
  });

  it('should work in controlled mode', () => {
    const labelText = 'Select fruits';
    const fn = jest.fn();
    const Example = () => {
      const [values, setValues] = React.useState(['apple']);
      return (
        <>
          <CheckboxGroup
            label={labelText}
            value={values}
            onChange={(vals) => {
              setValues(vals);
              fn(vals);
            }}
          >
            <Checkbox value="apple">Apple</Checkbox>
            <Checkbox value="mango">Mango</Checkbox>
            <Checkbox value="orange">Orange</Checkbox>
          </CheckboxGroup>
          <Text testID="values">{values.join(',')}</Text>
        </>
      );
    };
    const { getAllByA11yRole, getByA11yState, getByTestId } = renderWithTheme(<Example />);

    const checkbox = getByA11yState({ checked: true });
    expect(checkbox.props.value).toBe('apple');

    const checkboxes = getAllByA11yRole('checkbox');
    const apple = checkboxes.find((checkbox) => checkbox.props.value === 'apple');
    const mango = checkboxes.find((checkbox) => checkbox.props.value === 'mango');
    const orange = checkboxes.find((checkbox) => checkbox.props.value === 'orange');

    expect(apple?.props.accessibilityState.checked).toBeTruthy();
    expect(fn).not.toBeCalled();
    fireEvent.press(mango!);
    expect(mango?.props.accessibilityState.checked).toBeTruthy();
    expect(fn).toBeCalledWith(['apple', 'mango']);
    fireEvent.press(orange!);
    expect(orange?.props.accessibilityState.checked).toBeTruthy();
    expect(fn).toBeCalledWith(['apple', 'mango', 'orange']);
    fireEvent.press(apple!);
    expect(apple?.props.accessibilityState.checked).toBeFalsy();
    expect(fn).toBeCalledWith(['mango', 'orange']);
    expect(getByTestId('values').children[0]).toBe('mango,orange');
  });
});

describe('<CheckboxGroup /> runtime errors', () => {
  it('should throw error if defaultChecked,isChecked,onChange is passed to checkboxes', () => {
    const labelText = 'Select fruit';
    try {
      renderWithTheme(
        <CheckboxGroup label={labelText}>
          <Checkbox onChange={() => null} defaultChecked isChecked value="apple">
            Apple
          </Checkbox>
          <Checkbox value="mango">Mango</Checkbox>
          <Checkbox value="orange">Orange</Checkbox>
        </CheckboxGroup>,
      );
    } catch (err: any) {
      expect(err.message).toBe(
        "[Blade Checkbox]: Cannot set `defaultChecked,isChecked,onChange` on <Checkbox /> when it's inside <CheckboxGroup />, Please set it on the <CheckboxGroup /> itself",
      );
    }
  });

  it('should throw error if value is not present on Checkboxes', () => {
    const labelText = 'Select fruit';
    const errorMsg = `<CheckboxGroup /> requires that you pass unique "value" prop`;

    try {
      renderWithTheme(
        <CheckboxGroup label={labelText}>
          <Checkbox>Apple</Checkbox>
          <Checkbox>Mango</Checkbox>
          <Checkbox>Orange</Checkbox>
        </CheckboxGroup>,
      );
    } catch (err: any) {
      expect(err.message).toMatch(errorMsg);
    }
  });

  it('should throw error if validationState is used in Checkboxes', () => {
    const labelText = 'Select fruit';
    const errorMsg =
      "[Blade Checkbox]: Cannot set `validationState` on <Checkbox /> when it's inside <CheckboxGroup />, Please set it on the <CheckboxGroup /> itself";

    try {
      renderWithTheme(
        <CheckboxGroup label={labelText}>
          <Checkbox value="apple" validationState="error">
            Apple
          </Checkbox>
          <Checkbox value="mango">Mango</Checkbox>
          <Checkbox value="orange">Orange</Checkbox>
        </CheckboxGroup>,
      );
    } catch (err: any) {
      expect(err.message).toMatch(errorMsg);
    }
  });
});
