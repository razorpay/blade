/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import userEvents from '@testing-library/user-event';
import React from 'react';
import { Radio } from '../Radio';
import { RadioGroup } from '../RadioGroup/RadioGroup';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Button } from '~components/Button';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Radio />', () => {
  it('should render radio with label', () => {
    const labelText = 'Select fruit';
    const { container, getByText, getByRole } = renderWithTheme(
      <RadioGroup label={labelText}>
        <Radio value="apple">Apple</Radio>
      </RadioGroup>,
    );
    expect(container).toMatchSnapshot();
    expect(getByRole('radio', { name: 'Apple' })).toBeInTheDocument();
    expect(getByText(labelText)).toBeInTheDocument();
  });

  it('should render helpText', () => {
    const labelText = 'Select fruit';
    const helpText = 'This has to be checked';
    const { getByText } = renderWithTheme(
      <RadioGroup label={labelText}>
        <Radio value="apple" helpText={helpText}>
          Apple
        </Radio>
      </RadioGroup>,
    );
    expect(getByText(helpText)).toBeInTheDocument();
  });

  it('should set disabled state with isDisabled', () => {
    const labelText = 'Select fruit';
    const { container, getByRole } = renderWithTheme(
      <RadioGroup label={labelText}>
        <Radio value="apple" isDisabled>
          Apple
        </Radio>
      </RadioGroup>,
    );
    expect(container).toMatchSnapshot();
    expect(getByRole('radio', { name: 'Apple' })).toBeDisabled();
  });

  it('user should be able set checked state', async () => {
    const user = userEvents.setup();
    const labelText = 'Select fruit';
    const fruitApple = 'Apple';
    const { getByRole, getByLabelText } = renderWithTheme(
      <RadioGroup label={labelText}>
        <Radio value="apple">{fruitApple}</Radio>
      </RadioGroup>,
    );

    expect(getByRole('radio', { name: fruitApple })).not.toBeChecked();
    await user.click(getByLabelText(fruitApple));
    expect(getByRole('radio', { name: fruitApple })).toBeChecked();
    await user.click(getByLabelText(fruitApple));
    expect(getByRole('radio', { name: fruitApple })).toBeChecked();
  });

  it(`should expose native element methods via ref`, async () => {
    const label = 'Accept';

    const Example = (): React.ReactElement => {
      const ref = React.useRef<HTMLInputElement>(null);

      return (
        <>
          <RadioGroup label="focus test">
            <Radio value="1" ref={ref}>
              {label}
            </Radio>
          </RadioGroup>
          <Button
            onClick={() => {
              ref.current?.focus();
            }}
          >
            Focus
          </Button>
        </>
      );
    };
    const { getByLabelText, getByRole } = renderWithTheme(<Example />);

    const input = getByLabelText(label);
    const button = getByRole('button', { name: 'Focus' });

    expect(input).not.toHaveFocus();
    expect(input).toHaveAttribute('type', 'radio');

    await userEvents.click(button);
    expect(input).toHaveFocus();
  });

  it('should accept testID', () => {
    const labelText = 'Select fruit';
    const { getByTestId } = renderWithTheme(
      <RadioGroup label={labelText}>
        <Radio value="apple" testID="radio-test">
          Apple
        </Radio>
      </RadioGroup>,
    );
    expect(getByTestId('radio-test')).toBeTruthy();
  });

  it('should accepnt data-analytics attribute', () => {
    const labelText = 'Select fruit';
    const { container, getByRole } = renderWithTheme(
      <RadioGroup label={labelText}>
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
