/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import userEvents from '@testing-library/user-event';
import React from 'react';
import { Radio } from '../Radio';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<Radio />', () => {
  it('should render radio with label', () => {
    const labelText = 'Select fruit';
    const { container, getByText, getByRole } = renderWithTheme(<Radio>{labelText}</Radio>);
    expect(container).toMatchSnapshot();
    expect(getByRole('radio', { hidden: true })).toBeInTheDocument();
    expect(getByText(labelText)).toBeInTheDocument();
  });

  it('should render helpText', () => {
    const labelText = 'Select fruit';
    const helpText = 'This has to be checked';
    const { getByText } = renderWithTheme(<Radio helpText={helpText}>{labelText}</Radio>);
    expect(getByText(helpText)).toBeInTheDocument();
  });

  it('should set disabled state with isDisabled', () => {
    const labelText = 'Select fruit';
    const { container, getByRole } = renderWithTheme(<Radio isDisabled>{labelText}</Radio>);
    expect(container).toMatchSnapshot();
    expect(getByRole('radio', { hidden: true })).toBeDisabled();
  });

  test('user should be able set checked state', async () => {
    const user = userEvents.setup();
    const labelText = 'Select fruit';
    const { getByRole, getByLabelText } = renderWithTheme(<Radio>{labelText}</Radio>);

    expect(getByRole('radio', { hidden: true })).not.toBeChecked();
    await user.click(getByLabelText(labelText));
    expect(getByRole('radio', { hidden: true })).toBeChecked();
    await user.click(getByLabelText(labelText));
    expect(getByRole('radio', { hidden: true })).toBeChecked();
  });

  test('user should be able to set checked state with keyboard', async () => {
    const user = userEvents.setup();
    const labelText = 'Select fruit';
    const { getByRole } = renderWithTheme(<Radio>{labelText}</Radio>);

    expect(getByRole('radio', { hidden: true })).not.toBeChecked();
    await user.tab();
    expect(getByRole('radio', { hidden: true })).toHaveFocus();
    await user.keyboard('[Space]');
    expect(getByRole('radio', { hidden: true })).toBeChecked();
    await user.keyboard('[Space]');
    expect(getByRole('radio', { hidden: true })).toBeChecked();
  });
});
