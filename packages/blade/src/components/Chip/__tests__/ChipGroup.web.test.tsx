import userEvents from '@testing-library/user-event';
import React from 'react';
import { Chip } from '../Chip';
import type { ChipGroupProps } from '../ChipGroup';
import { ChipGroup } from '../ChipGroup';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

const selectionTypes: ChipGroupProps['selectionType'][] = ['single', 'multiple'];
const sizes: ChipGroupProps['size'][] = ['xsmall', 'small', 'medium', 'large'];
const colors: ChipGroupProps['color'][] = ['primary', 'positive', 'negative'];

describe('<ChipGroup />', () => {
  for (const selectionType of selectionTypes) {
    describe(`selectionType="${selectionType}"`, () => {
      it(`should render with selectionType="${selectionType}"`, () => {
        const labelText = 'Select fruits';
        const { container, getByRole } = renderWithTheme(
          <ChipGroup label={labelText} selectionType={selectionType}>
            <Chip value="apple">Apple</Chip>
            <Chip value="mango">Mango</Chip>
            <Chip value="orange">Orange</Chip>
          </ChipGroup>,
        );

        const chipRole = selectionType === 'single' ? 'radio' : 'checkbox';
        const chipGroupRole = selectionType === 'single' ? 'radiogroup' : 'group';
        expect(getByRole(chipGroupRole)).toBeInTheDocument();
        expect(getByRole(chipGroupRole)).toHaveTextContent(labelText);
        expect(getByRole(chipRole, { name: 'Apple' })).toBeInTheDocument();
        expect(getByRole(chipRole, { name: 'Mango' })).toBeInTheDocument();
        expect(container).toMatchSnapshot();
      });

      it('should render with help text', () => {
        const labelText = 'Select fruits';
        const helpText = 'Select one';
        const { getByRole } = renderWithTheme(
          <ChipGroup label={labelText} helpText={helpText} selectionType={selectionType}>
            <Chip value="apple">Apple</Chip>
            <Chip value="mango">Mango</Chip>
            <Chip value="orange">Orange</Chip>
          </ChipGroup>,
        );

        const chipGroupRole = selectionType === 'single' ? 'radiogroup' : 'group';
        expect(getByRole(chipGroupRole)).toHaveTextContent(labelText);
        expect(getByRole(chipGroupRole)).toHaveTextContent(helpText);
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

        expect(queryByText(helpText)).not.toBeInTheDocument();
        expect(queryByText(errorText)).toBeInTheDocument();
        getAllByRole(selectionType === 'single' ? 'radio' : 'checkbox').forEach((chip) => {
          expect(chip).toBeInvalid();
        });
      });

      sizes.forEach((size) => {
        it(`should render with size="${size}"`, () => {
          const { getByRole } = renderWithTheme(
            <ChipGroup accessibilityLabel="Select fruits" selectionType={selectionType} size={size}>
              <Chip value="apple">Apple</Chip>
              <Chip value="mango">Mango</Chip>
              <Chip value="orange">Orange</Chip>
            </ChipGroup>,
          );

          const chipRole = selectionType === 'single' ? 'radio' : 'checkbox';
          const chipGroupRole = selectionType === 'single' ? 'radiogroup' : 'group';
          expect(getByRole(chipGroupRole)).toBeInTheDocument();
          expect(getByRole(chipRole, { name: 'Apple' })).toBeInTheDocument();
          expect(getByRole(chipRole, { name: 'Mango' })).toBeInTheDocument();
        });
      });

      colors.forEach((color) => {
        it(`should render with color="${color}"`, () => {
          const { getByRole } = renderWithTheme(
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

          const chipRole = selectionType === 'single' ? 'radio' : 'checkbox';
          const chipGroupRole = selectionType === 'single' ? 'radiogroup' : 'group';
          expect(getByRole(chipGroupRole)).toBeInTheDocument();
          expect(getByRole(chipRole, { name: 'Apple' })).toBeInTheDocument();
          expect(getByRole(chipRole, { name: 'Mango' })).toBeInTheDocument();
        });
      });

      it('should propagate "isDisabled" prop to all children chips', () => {
        const { getAllByRole } = renderWithTheme(
          <ChipGroup accessibilityLabel="Select fruits" isDisabled selectionType={selectionType}>
            <Chip value="apple">Apple</Chip>
            <Chip value="mango">Mango</Chip>
            <Chip value="orange">Orange</Chip>
          </ChipGroup>,
        );

        const chipRole = selectionType === 'single' ? 'radio' : 'checkbox';
        getAllByRole(chipRole).forEach((chip) => {
          expect(chip).toBeDisabled();
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
          expect(chip).toHaveAttribute('name', 'fruits');
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

  it('should work in uncontrolled mode when selectionType="single"', async () => {
    const user = userEvents.setup({ autoModify: false });
    const fn = jest.fn();
    const { getByLabelText, getByRole } = renderWithTheme(
      <ChipGroup
        accessibilityLabel="Select fruits"
        selectionType="single"
        name="fruits"
        defaultValue="apple"
        onChange={({ values }) => fn(values)}
      >
        <Chip value="apple">Apple</Chip>
        <Chip value="mango">Mango</Chip>
        <Chip value="orange">Orange</Chip>
      </ChipGroup>,
    );

    const chipRole = 'radio';
    expect(getByRole(chipRole, { checked: true })).toHaveAttribute('value', 'apple');

    await user.tab();
    expect(getByLabelText('Apple')).toHaveFocus();
    await user.keyboard('[ArrowDown]');
    expect(getByLabelText('Mango')).toHaveFocus();
    expect(fn).toBeCalledWith(['mango']);
    await user.keyboard('[ArrowDown]');
    expect(getByLabelText('Orange')).toHaveFocus();
    expect(fn).toBeCalledWith(['orange']);
    await user.keyboard('[ArrowDown]');
    expect(getByLabelText('Apple')).toHaveFocus();
    expect(fn).toBeCalledWith(['apple']);
  });

  it('should work in uncontrolled mode when selectionType="multiple"', async () => {
    const user = userEvents.setup({ autoModify: false });
    const fn = jest.fn();
    const { getByLabelText, getByRole } = renderWithTheme(
      <ChipGroup
        accessibilityLabel="Select fruits"
        selectionType="multiple"
        name="fruits"
        defaultValue={['apple']}
        onChange={({ values }) => fn(values)}
      >
        <Chip value="apple">Apple</Chip>
        <Chip value="mango">Mango</Chip>
        <Chip value="orange">Orange</Chip>
      </ChipGroup>,
    );

    const chipRole = 'checkbox';
    expect(getByRole(chipRole, { checked: true })).toHaveAttribute('value', 'apple');

    await user.tab();
    expect(getByLabelText('Apple')).toHaveFocus();
    await user.keyboard('[Space]');
    expect(fn).toBeCalledWith([]);
    await user.tab();
    expect(getByLabelText('Mango')).toHaveFocus();
    await user.keyboard('[Space]');
    expect(fn).toBeCalledWith(['mango']);
    await user.tab();
    expect(getByLabelText('Orange')).toHaveFocus();
    await user.keyboard('[Space]');
    expect(fn).toBeCalledWith(['mango', 'orange']);
  });

  it('should work in controlled mode when selectionType="single"', async () => {
    const user = userEvents.setup();
    const fn = jest.fn();
    const Example = (): React.ReactElement => {
      const [value, setValue] = React.useState('apple');
      return (
        <>
          <ChipGroup
            accessibilityLabel="Select fruits"
            selectionType="single"
            value={value}
            onChange={({ values }) => {
              setValue(values[0]);
              fn(values);
            }}
          >
            <Chip value="apple">Apple</Chip>
            <Chip value="mango">Mango</Chip>
            <Chip value="orange">Orange</Chip>
          </ChipGroup>
          <p data-testid="values">{value}</p>
        </>
      );
    };
    const { getByLabelText, getByRole, getByTestId } = renderWithTheme(<Example />);
    const chipRole = 'radio';

    expect(getByRole(chipRole, { checked: true })).toHaveAttribute('value', 'apple');

    await user.tab();
    expect(getByLabelText('Apple')).toHaveFocus();
    await user.keyboard('[ArrowDown]');
    expect(getByLabelText('Mango')).toHaveFocus();
    expect(fn).toBeCalledWith(['mango']);
    await user.keyboard('[ArrowDown]');
    expect(getByLabelText('Orange')).toHaveFocus();
    expect(fn).toBeCalledWith(['orange']);
    await user.keyboard('[ArrowDown]');
    expect(getByLabelText('Apple')).toHaveFocus();
    expect(fn).toBeCalledWith(['apple']);
    expect(getByTestId('values')).toHaveTextContent('apple');
  });

  it('should work in controlled mode when selectionType="multiple"', async () => {
    const user = userEvents.setup();
    const fn = jest.fn();
    const Example = (): React.ReactElement => {
      const [values, setValues] = React.useState(['apple']);
      return (
        <>
          <ChipGroup
            accessibilityLabel="Select fruits"
            selectionType="multiple"
            value={values}
            onChange={({ values }) => {
              setValues(values);
              fn(values);
            }}
          >
            <Chip value="apple">Apple</Chip>
            <Chip value="mango">Mango</Chip>
            <Chip value="orange">Orange</Chip>
          </ChipGroup>
          <p data-testid="values">{values.join(',')}</p>
        </>
      );
    };
    const { getByLabelText, getByRole, getByTestId } = renderWithTheme(<Example />);
    const chipRole = 'checkbox';

    expect(getByRole(chipRole, { checked: true })).toHaveAttribute('value', 'apple');

    await user.tab();
    expect(getByLabelText('Apple')).toHaveFocus();
    await user.keyboard('[Space]');
    expect(fn).toBeCalledWith([]);
    await user.tab();
    expect(getByLabelText('Mango')).toHaveFocus();
    await user.keyboard('[Space]');
    expect(fn).toBeCalledWith(['mango']);
    await user.tab();
    expect(getByLabelText('Orange')).toHaveFocus();
    await user.keyboard('[Space]');
    expect(fn).toBeCalledWith(['mango', 'orange']);
    expect(getByTestId('values')).toHaveTextContent('mango,orange');
  });
});
