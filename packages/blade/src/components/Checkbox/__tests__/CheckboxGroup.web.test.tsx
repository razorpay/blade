/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-implicit-any-catch */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import userEvents from '@testing-library/user-event';
import React from 'react';
import { Checkbox } from '../Checkbox';
import { CheckboxGroup } from '../CheckboxGroup';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

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

    getAllByRole('checkbox').forEach((checkbox) => {
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

    getAllByRole('checkbox').forEach((checkbox) => {
      expect(checkbox).toHaveAttribute('name', 'fruits');
    });
  });

  it('should render helpText of individual checkboxes when inside group', () => {
    const labelText = 'Select fruits';
    const helpText = 'Select one';

    const { queryByText } = renderWithTheme(
      <CheckboxGroup helpText={helpText} label={labelText}>
        <Checkbox helpText="Apple help" value="apple">
          Apple
        </Checkbox>
        <Checkbox helpText="Mango help" value="mango">
          Mango
        </Checkbox>
      </CheckboxGroup>,
    );

    expect(queryByText(helpText)).toBeInTheDocument();
    expect(queryByText('Apple help')).toBeInTheDocument();
    expect(queryByText('Mango help')).toBeInTheDocument();
  });

  it('should render errorText when validationState is set to error', () => {
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
    getAllByRole('checkbox').forEach((checkbox) => {
      expect(checkbox).toBeInvalid();
    });
  });

  it('should not render errorText of individual checkboxes when validationState is set to error', () => {
    const labelText = 'Select fruits';
    const errorText = 'Invalid selection';

    const { queryByText } = renderWithTheme(
      <CheckboxGroup errorText={errorText} label={labelText} validationState="error">
        <Checkbox errorText="Apple error" value="apple">
          Apple
        </Checkbox>
        <Checkbox errorText="Mango error" value="mango">
          Mango
        </Checkbox>
      </CheckboxGroup>,
    );

    expect(queryByText(errorText)).toBeInTheDocument();
    expect(queryByText('Apple error')).not.toBeInTheDocument();
    expect(queryByText('Mango error')).not.toBeInTheDocument();
  });

  it('should work in uncontrolled mode', async () => {
    const user = userEvents.setup();
    const labelText = 'Select fruits';
    const fn = jest.fn();
    const { getByLabelText, getByRole } = renderWithTheme(
      <CheckboxGroup
        label={labelText}
        defaultValue={['apple']}
        onChange={({ values }) => fn(values)}
      >
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="mango">Mango</Checkbox>
        <Checkbox value="orange">Orange</Checkbox>
      </CheckboxGroup>,
    );

    expect(getByRole('checkbox', { checked: true })).toHaveAttribute('value', 'apple');

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
            onChange={({ values }) => {
              setValues(values);
              fn(values);
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

    expect(getByRole('checkbox', { checked: true })).toHaveAttribute('value', 'apple');

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
        "[Blade: Checkbox]: Cannot set `defaultChecked,isChecked,onChange` on <Checkbox /> when it's inside <CheckboxGroup />, Please set it on the <CheckboxGroup /> itself",
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
      "[Blade: Checkbox]: Cannot set `validationState` on <Checkbox /> when it's inside <CheckboxGroup />, Please set it on the <CheckboxGroup /> itself";

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

describe('<CheckboxGroup /> integration tests', () => {
  test('Indeterminate checkbox toggling validationState', async () => {
    const user = userEvents.setup();
    const Example = () => {
      const fields = ['apple', 'mango', 'orange'];
      const [selected, setSelected] = React.useState(['apple', 'mango']);
      const allChecked = selected.length === 3;
      const isIndeterminate = selected.length > 0 && !allChecked;

      return (
        <>
          <Checkbox
            isChecked={allChecked}
            onChange={(value) => {
              if (value) {
                setSelected(fields);
                return;
              }
              setSelected([]);
            }}
            isIndeterminate={isIndeterminate}
          >
            Select all
          </Checkbox>
          <CheckboxGroup
            helpText="Select atleast one"
            label="Select fruits"
            value={selected}
            validationState={isIndeterminate ? 'error' : 'none'}
            onChange={({ values }) => setSelected(values)}
          >
            {fields.map((field) => {
              return (
                <Checkbox key={field} value={field}>
                  {field}
                </Checkbox>
              );
            })}
          </CheckboxGroup>
        </>
      );
    };

    const { getByLabelText } = renderWithTheme(<Example />);
    expect(getByLabelText('apple')).toBeChecked();
    expect(getByLabelText('mango')).toBeChecked();
    expect(getByLabelText('orange')).not.toBeChecked();
    expect(getByLabelText('Select all')).not.toBeChecked();
    expect((getByLabelText('Select all') as HTMLInputElement).indeterminate).toBe(true);

    await user.tab();
    expect(getByLabelText('Select all')).toHaveFocus();
    expect(getByLabelText('apple')).toBeChecked();
    expect(getByLabelText('mango')).toBeChecked();
    expect(getByLabelText('orange')).not.toBeChecked();
    expect((getByLabelText('Select all') as HTMLInputElement).indeterminate).toBe(true);
    await user.keyboard('[Space]');
    expect(getByLabelText('apple')).toBeChecked();
    expect(getByLabelText('mango')).toBeChecked();
    expect(getByLabelText('orange')).toBeChecked();
    expect(getByLabelText('Select all')).toBeChecked();
    await user.tab();
    expect(getByLabelText('apple')).toHaveFocus();
    await user.keyboard('[Space]');
    expect(getByLabelText('apple')).not.toBeChecked();
    expect(getByLabelText('mango')).toBeChecked();
    expect(getByLabelText('orange')).toBeChecked();
    expect(getByLabelText('apple')).toBeInvalid();
    expect(getByLabelText('mango')).toBeInvalid();
    expect(getByLabelText('orange')).toBeInvalid();
    expect(getByLabelText('Select all')).not.toBeChecked();
    expect((getByLabelText('Select all') as HTMLInputElement).indeterminate).toBe(true);
    await user.tab();
    await user.tab();
    expect(getByLabelText('orange')).toHaveFocus();
    expect(getByLabelText('orange')).toBeChecked();
  });

  it('should accept testID', () => {
    const labelText = 'Select fruits';
    const { getByTestId } = renderWithTheme(
      <CheckboxGroup label={labelText} testID="checkbox-group-test">
        <Checkbox value="apple">Apple</Checkbox>
      </CheckboxGroup>,
    );
    expect(getByTestId('checkbox-group-test')).toBeTruthy();
  });
  it('should accept data-analytics attribute', () => {
    const labelText = 'Select fruits';
    const { container } = renderWithTheme(
      <CheckboxGroup label={labelText} data-analytics-checkbox-group="select fruits">
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="mango">Mango</Checkbox>
      </CheckboxGroup>,
    );
    expect(
      container.querySelector('[data-analytics-checkbox-group="select fruits"]'),
    ).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
