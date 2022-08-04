/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-implicit-any-catch */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import userEvents from '@testing-library/user-event';
import React from 'react';
import renderWithTheme from '../../../_helpers/testing/renderWithTheme.web';
import { Radio } from '../Radio';
import { RadioGroup } from '../RadioGroup/RadioGroup';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<RadioGroup />', () => {
  it('should render with label', () => {
    const labelText = 'Select fav fruit';
    const { container, getByRole } = renderWithTheme(
      <RadioGroup label={labelText}>
        <Radio value="apple">Apple</Radio>
        <Radio value="mango">Mango</Radio>
        <Radio value="orange">Orange</Radio>
      </RadioGroup>,
    );
    expect(container).toMatchSnapshot();
    expect(getByRole('group')).toHaveTextContent(labelText);
  });

  it('should render with help text', () => {
    const labelText = 'Select fruits';
    const helpText = 'Select one';
    const { container, getByRole, queryByText } = renderWithTheme(
      <RadioGroup helpText={helpText} label={labelText}>
        <Radio value="apple">Apple</Radio>
        <Radio value="mango">Mango</Radio>
        <Radio value="orange">Orange</Radio>
      </RadioGroup>,
    );
    expect(container).toMatchSnapshot();
    expect(getByRole('group')).toHaveTextContent(labelText);
    expect(queryByText(helpText)).toBeInTheDocument();
  });

  it('should propagate isDisabled prop to child checkboxes', () => {
    const labelText = 'Select fruits';
    const { getAllByRole } = renderWithTheme(
      <RadioGroup isDisabled label={labelText}>
        <Radio value="apple">Apple</Radio>
        <Radio value="mango">Mango</Radio>
        <Radio value="orange">Orange</Radio>
      </RadioGroup>,
    );

    getAllByRole('radio', { hidden: true }).forEach((radio) => {
      expect(radio).toBeDisabled();
    });
  });

  it('should propagate name prop to child checkboxes', () => {
    const labelText = 'Select fruits';
    const { getAllByRole } = renderWithTheme(
      <RadioGroup isDisabled label={labelText} name="fruits">
        <Radio value="apple">Apple</Radio>
        <Radio value="mango">Mango</Radio>
        <Radio value="orange">Orange</Radio>
      </RadioGroup>,
    );

    getAllByRole('radio', { hidden: true }).forEach((radio) => {
      expect(radio).toHaveAttribute('name', 'fruits');
    });
  });

  it('should render helpText of individual checkboxes when inside group', () => {
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

    expect(queryByText(helpText)).toBeInTheDocument();
    expect(queryByText('Apple help')).toBeInTheDocument();
    expect(queryByText('Mango help')).toBeInTheDocument();
  });

  it('should render errorText when validationState is set to error', () => {
    const labelText = 'Select fruits';
    const helpText = 'Select one';
    const errorText = 'Invalid selection';

    const { getAllByRole, queryByText } = renderWithTheme(
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

    expect(queryByText(helpText)).not.toBeInTheDocument();
    expect(queryByText(errorText)).toBeInTheDocument();
    getAllByRole('radio', { hidden: true }).forEach((radio) => {
      expect(radio).toBeInvalid();
    });
  });

  it('should work in uncontrolled mode', async () => {
    const user = userEvents.setup({ autoModify: false });
    const labelText = 'Select fruits';
    const fn = jest.fn();
    const { getByLabelText, getByRole } = renderWithTheme(
      <RadioGroup
        name="fruits"
        label={labelText}
        defaultValue="apple"
        onChange={({ value }) => fn(value)}
      >
        <Radio value="apple">Apple</Radio>
        <Radio value="mango">Mango</Radio>
        <Radio value="orange">Orange</Radio>
      </RadioGroup>,
    );

    expect(getByRole('radio', { hidden: true, checked: true })).toHaveAttribute('value', 'apple');

    await user.tab();
    expect(getByLabelText('Apple')).toHaveFocus();
    await user.keyboard('[ArrowDown]');
    expect(getByLabelText('Mango')).toHaveFocus();
    expect(fn).toBeCalledWith('mango');
    await user.keyboard('[ArrowDown]');
    expect(getByLabelText('Orange')).toHaveFocus();
    expect(fn).toBeCalledWith('orange');
    await user.keyboard('[ArrowDown]');
    expect(getByLabelText('Apple')).toHaveFocus();
    expect(fn).toBeCalledWith('apple');
  });

  it('should work in controlled mode', async () => {
    const user = userEvents.setup();
    const labelText = 'Select fruits';
    const fn = jest.fn();
    const Example = () => {
      const [value, setValue] = React.useState('apple');
      return (
        <>
          <RadioGroup
            label={labelText}
            value={value}
            onChange={({ value }) => {
              setValue(value);
              fn(value);
            }}
          >
            <Radio value="apple">Apple</Radio>
            <Radio value="mango">Mango</Radio>
            <Radio value="orange">Orange</Radio>
          </RadioGroup>
          <p data-testid="values">{value}</p>
        </>
      );
    };
    const { getByLabelText, getByRole, getByTestId } = renderWithTheme(<Example />);

    expect(getByRole('radio', { hidden: true, checked: true })).toHaveAttribute('value', 'apple');

    await user.tab();
    expect(getByLabelText('Apple')).toHaveFocus();
    await user.keyboard('[ArrowDown]');
    expect(getByLabelText('Mango')).toHaveFocus();
    expect(fn).toBeCalledWith('mango');
    await user.keyboard('[ArrowDown]');
    expect(getByLabelText('Orange')).toHaveFocus();
    expect(fn).toBeCalledWith('orange');
    await user.keyboard('[ArrowDown]');
    expect(getByLabelText('Apple')).toHaveFocus();
    expect(fn).toBeCalledWith('apple');
    expect(getByTestId('values')).toHaveTextContent('apple');
  });
});

describe('<RadioGroup /> runtime errors', () => {
  it('should throw error if defaultChecked,isChecked,onChange is passed to checkboxes', () => {
    const labelText = 'Select fruit';
    try {
      renderWithTheme(
        <RadioGroup label={labelText}>
          <Radio onChange={() => null} defaultChecked isChecked value="apple">
            Apple
          </Radio>
          <Radio value="mango">Mango</Radio>
          <Radio value="orange">Orange</Radio>
        </RadioGroup>,
      );
    } catch (err: any) {
      expect(err.message).toBe(
        "[Blade Radio]: Cannot set `defaultChecked,isChecked,onChange` on <Radio /> when it's inside <RadioGroup />, Please set it on the <RadioGroup /> itself",
      );
    }
  });
});
