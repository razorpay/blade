/* eslint-disable @typescript-eslint/no-implicit-any-catch */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import userEvents from '@testing-library/user-event';
import React from 'react';
import renderWithTheme from '../../../_helpers/testing/renderWithTheme.web';
import { Checkbox } from '../Checkbox';
import { CheckboxGroup } from '../CheckboxGroup';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<CheckboxGroup />', () => {
  it('should render with label', () => {
    const labelText = 'Select fruits';
    const { container, getByRole } = renderWithTheme(
      <CheckboxGroup label={labelText}>
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="mango">Mango</Checkbox>
        <Checkbox value="orange">Orange</Checkbox>
      </CheckboxGroup>,
    );
    expect(container).toMatchSnapshot();
    expect(getByRole('group')).toHaveTextContent(labelText);
  });

  it('should render with help text', () => {
    const labelText = 'Select fruits';
    const helpText = 'Select one';
    const { container, getByRole, queryByText } = renderWithTheme(
      <CheckboxGroup helpText={helpText} label={labelText}>
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="mango">Mango</Checkbox>
        <Checkbox value="orange">Orange</Checkbox>
      </CheckboxGroup>,
    );
    expect(container).toMatchSnapshot();
    expect(getByRole('group')).toHaveTextContent(labelText);
    expect(queryByText(helpText)).toBeInTheDocument();
  });

  it('should propagate isDisabled prop to child checkboxes', () => {
    const labelText = 'Select fruits';
    const { getAllByRole } = renderWithTheme(
      <CheckboxGroup isDisabled label={labelText}>
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="mango">Mango</Checkbox>
        <Checkbox value="orange">Orange</Checkbox>
      </CheckboxGroup>,
    );

    getAllByRole('checkbox', { hidden: true }).forEach((checkbox) => {
      expect(checkbox).toBeDisabled();
    });
  });

  it('should propagate name prop to child checkboxes', () => {
    const labelText = 'Select fruits';
    const { getAllByRole } = renderWithTheme(
      <CheckboxGroup isDisabled label={labelText} name="fruits">
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="mango">Mango</Checkbox>
        <Checkbox value="orange">Orange</Checkbox>
      </CheckboxGroup>,
    );

    getAllByRole('checkbox', { hidden: true }).forEach((checkbox) => {
      expect(checkbox).toHaveAttribute('name', 'fruits');
    });
  });

  it('should render errorText when hasError is set to true', () => {
    const labelText = 'Select fruits';
    const helpText = 'Select one';
    const errorText = 'Invalid selection';

    const { getAllByRole, queryByText } = renderWithTheme(
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

    expect(queryByText(helpText)).not.toBeInTheDocument();
    expect(queryByText(errorText)).toBeInTheDocument();
    getAllByRole('checkbox', { hidden: true }).forEach((checkbox) => {
      expect(checkbox).toBeInvalid();
    });
  });

  it('should work in uncontrolled mode', async () => {
    const user = userEvents.setup();
    const labelText = 'Select fruits';
    const fn = jest.fn();
    const { getByLabelText, getByRole } = renderWithTheme(
      <CheckboxGroup label={labelText} defaultValue={['apple']} onChange={(values) => fn(values)}>
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="mango">Mango</Checkbox>
        <Checkbox value="orange">Orange</Checkbox>
      </CheckboxGroup>,
    );

    expect(getByRole('checkbox', { hidden: true, checked: true })).toHaveAttribute(
      'value',
      'apple',
    );

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

  it('should work in controlled mode', async () => {
    const user = userEvents.setup();
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
          <p data-testid="values">{values.join(',')}</p>
        </>
      );
    };
    const { getByLabelText, getByRole, getByTestId } = renderWithTheme(<Example />);

    expect(getByRole('checkbox', { hidden: true, checked: true })).toHaveAttribute(
      'value',
      'apple',
    );

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
