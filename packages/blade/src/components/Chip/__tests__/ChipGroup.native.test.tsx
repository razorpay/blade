import { fireEvent } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import type { ReactTestInstance } from 'react-test-renderer';
import { Chip } from '../Chip';
import type { ChipGroupProps } from '../ChipGroup';
import { ChipGroup } from '../ChipGroup';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

const selectionTypes: ChipGroupProps['selectionType'][] = ['single', 'multiple'];
const sizes: ChipGroupProps['size'][] = ['xsmall', 'small', 'medium', 'large'];
const colors: ChipGroupProps['color'][] = ['primary', 'positive', 'negative'];

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<ChipGroup />', () => {
  for (const selectionType of selectionTypes) {
    describe(`selectionType="${selectionType}"`, () => {
      it(`should render with selectionType="${selectionType}"`, () => {
        const labelText = 'Select fruits';
        const { toJSON, getByText } = renderWithTheme(
          <ChipGroup label={labelText} selectionType={selectionType}>
            <Chip value="apple">Apple</Chip>
            <Chip value="mango">Mango</Chip>
            <Chip value="orange">Orange</Chip>
          </ChipGroup>,
        );

        expect(getByText('Apple')).toBeDefined();
        expect(getByText('Mango')).toBeDefined();
        expect(getByText('Orange')).toBeDefined();
        expect(getByText(labelText)).toBeDefined();
        expect(toJSON()).toMatchSnapshot();
      });

      it('should render with help text', () => {
        const labelText = 'Select fruits';
        const helpText = 'Select one';
        const { getByText } = renderWithTheme(
          <ChipGroup label={labelText} helpText={helpText} selectionType={selectionType}>
            <Chip value="apple">Apple</Chip>
            <Chip value="mango">Mango</Chip>
            <Chip value="orange">Orange</Chip>
          </ChipGroup>,
        );

        expect(getByText(helpText)).toBeDefined();
      });

      it('should render errorText when validationState is set to error', () => {
        const labelText = 'Select fruits';
        const helpText = 'Select one';
        const errorText = 'Invalid selection';

        const { getAllByRole, queryByText } = renderWithTheme(
          <ChipGroup
            helpText={helpText}
            errorText={errorText}
            label={labelText}
            validationState="error"
            selectionType={selectionType}
          >
            <Chip value="apple">Apple</Chip>
            <Chip value="mango">Mango</Chip>
            <Chip value="orange">Orange</Chip>
          </ChipGroup>,
        );

        expect(queryByText(helpText)).toBeFalsy();
        expect(queryByText(errorText)).toBeTruthy();

        const chips = getAllByRole(selectionType === 'single' ? 'radio' : 'checkbox');
        chips.forEach((chip) => {
          expect(chip.props.accessibilityInvalid).toBeTruthy();
        });
      });

      sizes.forEach((size) => {
        it(`should render with size="${size}"`, () => {
          const { getByText } = renderWithTheme(
            <ChipGroup accessibilityLabel="Select fruits" selectionType={selectionType} size={size}>
              <Chip value="apple">Apple</Chip>
              <Chip value="mango">Mango</Chip>
              <Chip value="orange">Orange</Chip>
            </ChipGroup>,
          );

          expect(getByText('Apple')).toBeDefined();
          expect(getByText('Mango')).toBeDefined();
          expect(getByText('Orange')).toBeDefined();
        });
      });

      colors.forEach((color) => {
        it(`should render with color="${color}"`, () => {
          const { getByText } = renderWithTheme(
            <ChipGroup
              accessibilityLabel="Select fruits"
              selectionType={selectionType}
              color={color}
            >
              <Chip value="apple">Apple</Chip>
              <Chip value="mango">Mango</Chip>
              <Chip value="orange">Orange</Chip>
            </ChipGroup>,
          );

          expect(getByText('Apple')).toBeDefined();
          expect(getByText('Mango')).toBeDefined();
          expect(getByText('Orange')).toBeDefined();
        });
      });

      it('should propagate the "isDisabled" prop to all children chips', () => {
        const { getAllByRole } = renderWithTheme(
          <ChipGroup accessibilityLabel="Select fruits" isDisabled selectionType={selectionType}>
            <Chip value="apple">Apple</Chip>
            <Chip value="mango">Mango</Chip>
            <Chip value="orange">Orange</Chip>
          </ChipGroup>,
        );

        const chipRole = selectionType === 'single' ? 'radio' : 'checkbox';
        getAllByRole(chipRole).forEach((chip) => {
          expect(chip.props.accessibilityState.disabled).toBe(true);
        });
      });

      it('should propagate name prop to children chips', () => {
        const { getAllByRole } = renderWithTheme(
          <ChipGroup accessibilityLabel="Select fruits" name="fruits" selectionType={selectionType}>
            <Chip value="apple">Apple</Chip>
            <Chip value="mango">Mango</Chip>
            <Chip value="orange">Orange</Chip>
          </ChipGroup>,
        );

        const chipRole = selectionType === 'single' ? 'radio' : 'checkbox';
        getAllByRole(chipRole).forEach((chip) => {
          expect(chip.props.name).toBe('fruits');
        });
      });

      it('should accept testID', () => {
        const { getByTestId } = renderWithTheme(
          <ChipGroup
            accessibilityLabel="Select fruits"
            selectionType={selectionType}
            testID="chip-group-test"
          >
            <Chip value="apple">Apple</Chip>
            <Chip value="mango">Mango</Chip>
          </ChipGroup>,
        );
        expect(getByTestId('chip-group-test')).toBeTruthy();
      });
    });
  }

  it('should work in uncontrolled mode with selectionType="single"', () => {
    const onChange = jest.fn();
    const { getByA11yState, getAllByRole } = renderWithTheme(
      <ChipGroup
        accessibilityLabel="Select fruits"
        selectionType="single"
        name="fruits"
        defaultValue="apple"
        onChange={onChange}
      >
        <Chip value="apple">Apple</Chip>
        <Chip value="mango">Mango</Chip>
        <Chip value="orange">Orange</Chip>
      </ChipGroup>,
    );

    const chip = getByA11yState({ checked: true });
    expect(chip.props.value).toBe('apple');

    const chips = getAllByRole('radio');
    const apple = chips.find((chip) => chip.props.value === 'apple');
    const mango = chips.find((chip) => chip.props.value === 'mango');
    const orange = chips.find((chip) => chip.props.value === 'orange');

    expect(apple?.props.accessibilityState.checked).toBeTruthy();
    expect(onChange).not.toBeCalled();

    fireEvent.press(mango as ReactTestInstance);
    expect(mango?.props.accessibilityState.checked).toBeTruthy();
    expect(onChange).toBeCalledWith({ values: ['mango'], name: 'fruits' });
    fireEvent.press(orange as ReactTestInstance);
    expect(orange?.props.accessibilityState.checked).toBeTruthy();
    expect(onChange).toBeCalledWith({ values: ['orange'], name: 'fruits' });
    fireEvent.press(apple as ReactTestInstance);
    expect(apple?.props.accessibilityState.checked).toBeTruthy();
    expect(onChange).toBeCalledWith({ values: ['apple'], name: 'fruits' });
  });

  it('should work in uncontrolled mode with selectionType="multiple"', () => {
    const onChange = jest.fn();
    const { getByA11yState, getAllByRole } = renderWithTheme(
      <ChipGroup
        accessibilityLabel="Select fruits"
        selectionType="multiple"
        name="fruits"
        defaultValue={['apple']}
        onChange={onChange}
      >
        <Chip value="apple">Apple</Chip>
        <Chip value="mango">Mango</Chip>
        <Chip value="orange">Orange</Chip>
      </ChipGroup>,
    );

    const chip = getByA11yState({ checked: true });
    expect(chip.props.value).toBe('apple');

    const chips = getAllByRole('checkbox');
    const apple = chips.find((chip) => chip.props.value === 'apple');
    const mango = chips.find((chip) => chip.props.value === 'mango');
    const orange = chips.find((chip) => chip.props.value === 'orange');

    expect(apple?.props.accessibilityState.checked).toBeTruthy();
    expect(onChange).not.toBeCalled();

    // Check Mango
    fireEvent.press(mango as ReactTestInstance);
    expect(mango?.props.accessibilityState.checked).toBeTruthy();
    expect(onChange).toBeCalledWith({ values: ['apple', 'mango'], name: 'fruits' });
    // Check orange
    fireEvent.press(orange as ReactTestInstance);
    expect(orange?.props.accessibilityState.checked).toBeTruthy();
    expect(onChange).toBeCalledWith({ values: ['apple', 'mango', 'orange'], name: 'fruits' });
    // Uncheck apple
    fireEvent.press(apple as ReactTestInstance);
    expect(apple?.props.accessibilityState.checked).toBeFalsy();
    expect(onChange).toBeCalledWith({ values: ['mango', 'orange'], name: 'fruits' });
  });

  it('should work in controlled mode with selectionType="single"', () => {
    const onChange = jest.fn();
    const Example = (): React.ReactElement => {
      const [value, setValue] = React.useState('apple');
      return (
        <>
          <ChipGroup
            accessibilityLabel="Select fruits"
            selectionType="single"
            name="fruits"
            defaultValue="apple"
            onChange={({ values }) => {
              setValue(values[0]);
              onChange(values);
            }}
          >
            <Chip value="apple">Apple</Chip>
            <Chip value="mango">Mango</Chip>
            <Chip value="orange">Orange</Chip>
          </ChipGroup>
          <Text testID="values">{value}</Text>
        </>
      );
    };

    const { getByA11yState, getAllByRole, getByTestId } = renderWithTheme(<Example />);

    const chip = getByA11yState({ checked: true });
    expect(chip.props.value).toBe('apple');

    const chips = getAllByRole('radio');
    const apple = chips.find((chip) => chip.props.value === 'apple');
    const mango = chips.find((chip) => chip.props.value === 'mango');
    const orange = chips.find((chip) => chip.props.value === 'orange');

    expect(apple?.props.accessibilityState.checked).toBeTruthy();
    expect(onChange).not.toBeCalled();

    // Check Mango
    fireEvent.press(mango as ReactTestInstance);
    expect(mango?.props.accessibilityState.checked).toBeTruthy();
    expect(onChange).toBeCalledWith(['mango']);
    // Check Orange
    fireEvent.press(orange as ReactTestInstance);
    expect(orange?.props.accessibilityState.checked).toBeTruthy();
    expect(onChange).toBeCalledWith(['orange']);
    // Check Apple
    fireEvent.press(apple as ReactTestInstance);
    expect(apple?.props.accessibilityState.checked).toBeTruthy();
    expect(onChange).toBeCalledWith(['apple']);
    expect(getByTestId('values').children[0]).toBe('apple');
  });

  it('should work in controlled mode with selectionType="multiple"', () => {
    const onChange = jest.fn();
    const Example = (): React.ReactElement => {
      const [values, setValues] = React.useState(['apple']);
      return (
        <>
          <ChipGroup
            accessibilityLabel="Select fruits"
            selectionType="multiple"
            name="fruits"
            defaultValue={['apple']}
            onChange={({ values }) => {
              setValues(values);
              onChange(values);
            }}
          >
            <Chip value="apple">Apple</Chip>
            <Chip value="mango">Mango</Chip>
            <Chip value="orange">Orange</Chip>
          </ChipGroup>
          <Text testID="values">{values.join(', ')}</Text>
        </>
      );
    };

    const { getByA11yState, getAllByRole, getByTestId } = renderWithTheme(<Example />);

    const chip = getByA11yState({ checked: true });
    expect(chip.props.value).toBe('apple');

    const chips = getAllByRole('checkbox');
    const apple = chips.find((chip) => chip.props.value === 'apple');
    const mango = chips.find((chip) => chip.props.value === 'mango');
    const orange = chips.find((chip) => chip.props.value === 'orange');

    expect(apple?.props.accessibilityState.checked).toBeTruthy();
    expect(onChange).not.toBeCalled();

    // Check Mango
    fireEvent.press(mango as ReactTestInstance);
    expect(mango?.props.accessibilityState.checked).toBeTruthy();
    expect(onChange).toBeCalledWith(['apple', 'mango']);
    // Check orange
    fireEvent.press(orange as ReactTestInstance);
    expect(orange?.props.accessibilityState.checked).toBeTruthy();
    expect(onChange).toBeCalledWith(['apple', 'mango', 'orange']);
    // Uncheck apple
    fireEvent.press(apple as ReactTestInstance);
    expect(apple?.props.accessibilityState.checked).toBeFalsy();
    expect(onChange).toBeCalledWith(['mango', 'orange']);
    expect(getByTestId('values').children[0]).toBe('mango, orange');
  });
});
