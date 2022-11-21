/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import userEvents from '@testing-library/user-event';
import React from 'react';
import { Radio } from '../Radio';
import { RadioGroup } from '../RadioGroup/RadioGroup';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Radio />', () => {
  it('should render radio with label', () => {
    const labelText = 'Select fruit';
    const { container, getByText, getByRole } = renderWithTheme(
      <RadioGroup label="Radio group">
        <Radio value="a">{labelText}</Radio>
      </RadioGroup>,
    );
    expect(container).toMatchSnapshot();
    expect(getByRole('radio', { name: labelText })).toBeInTheDocument();
    expect(getByText(labelText)).toBeInTheDocument();
  });

  it('should render helpText', () => {
    const labelText = 'Select fruit';
    const helpText = 'This has to be checked';
    const { getByText } = renderWithTheme(
      <RadioGroup label="Radio group">
        <Radio value="a" helpText={helpText}>
          {labelText}
        </Radio>
      </RadioGroup>,
    );
    expect(getByText(helpText)).toBeInTheDocument();
  });

  it('should set disabled state with isDisabled', () => {
    const labelText = 'Select fruit';
    const { container, getByRole } = renderWithTheme(
      <RadioGroup label="Radio group">
        <Radio value="a" isDisabled>
          {labelText}
        </Radio>
      </RadioGroup>,
    );
    expect(container).toMatchSnapshot();
    expect(getByRole('radio', { name: labelText })).toBeDisabled();
  });

  test('user should be able set checked state', async () => {
    const user = userEvents.setup();
    const labelText = 'Select fruit';
    const { getByRole, getByLabelText } = renderWithTheme(
      <RadioGroup label="Radio group">
        <Radio value="a">{labelText}</Radio>
      </RadioGroup>,
    );

    expect(getByRole('radio', { name: labelText })).not.toBeChecked();
    await user.click(getByLabelText(labelText));
    expect(getByRole('radio', { name: labelText })).toBeChecked();
    await user.click(getByLabelText(labelText));
    expect(getByRole('radio', { name: labelText })).toBeChecked();
  });
});
