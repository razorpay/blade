/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import userEvents from '@testing-library/user-event';
import React from 'react';
import { Radio } from '../Radio';
import { RadioGroup } from '../RadioGroup/RadioGroup';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

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
    expect(getByRole('radiogroup')).toHaveTextContent(labelText);
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
    expect(getByRole('radiogroup')).toHaveTextContent(labelText);
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

    getAllByRole('radio').forEach((radio) => {
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

    getAllByRole('radio').forEach((radio) => {
      expect(radio).toHaveAttribute('name', 'fruits');
    });
  });

  it('should render helpText of individual checkboxes when inside group', () => {
    const labelText = 'Select fruits';
    const helpText = 'Select one';

    const { getByText } = renderWithTheme(
      <RadioGroup helpText={helpText} label={labelText}>
        <Radio helpText="Apple Help" value="apple">
          Apple
        </Radio>
        <Radio helpText="Mango Help" value="mango">
          Mango
        </Radio>
      </RadioGroup>,
    );

    expect(getByText(helpText)).toBeInTheDocument();
    expect(getByText('Apple Help')).toBeInTheDocument();
    expect(getByText('Mango Help')).toBeInTheDocument();
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
    getAllByRole('radio').forEach((radio) => {
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

    expect(getByRole('radio', { checked: true })).toHaveAttribute('value', 'apple');

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

    expect(getByRole('radio', { checked: true })).toHaveAttribute('value', 'apple');

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

  it('should accept testID', () => {
    const labelText = 'Select fruit';
    const { getByTestId } = renderWithTheme(
      <RadioGroup label={labelText} testID="radio-group-test">
        <Radio value="apple">Apple</Radio>
      </RadioGroup>,
    );
    expect(getByTestId('radio-group-test')).toBeTruthy();
  });

  it('should accepnt data-analytics attribute', () => {
    const labelText = 'Select fruit';
    const { container, getByRole } = renderWithTheme(
      <RadioGroup label={labelText} data-analytics-radio-group="fruits">
        <Radio value="apple" data-analytics-radio-value="apple">
          Apple
        </Radio>
      </RadioGroup>,
    );
    expect(getByRole('radio', { name: 'Apple' })).toHaveAttribute(
      'data-analytics-radio-value',
      'apple',
    );
    expect(container).toMatchSnapshot();
  });
});
