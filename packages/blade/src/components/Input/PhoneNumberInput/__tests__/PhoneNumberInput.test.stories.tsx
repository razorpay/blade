/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable import/no-extraneous-dependencies */
import type { StoryFn } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import { expect, jest } from '@storybook/jest';
import React from 'react';
import { PhoneNumberInput } from '../PhoneNumberInput';

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const label = 'Phone Number';
const onChangeFn = jest.fn();
export const SelectACountry: StoryFn<typeof PhoneNumberInput> = (): React.ReactElement => {
  return <PhoneNumberInput label={label} />;
};

SelectACountry.play = async () => {
  const { getByLabelText, queryByRole, getByRole } = within(document.body);

  await sleep(100);
  // Ensure the country selector is closed
  await expect(queryByRole('menu')).not.toBeInTheDocument();

  // Click on the country selector and open it
  await userEvent.click(getByRole('button', { name: /select country/i }));
  await sleep(300);

  // Use arrow keys to navigate to a country
  await userEvent.keyboard('{arrowdown}');
  await userEvent.keyboard('{arrowdown}');

  // Click on the country to select it
  await userEvent.keyboard('{enter}');
  await sleep(300);

  // Ensure the country selector is closed
  await expect(queryByRole('menu')).not.toBeInTheDocument();

  // expect albania to be selected
  await expect(getByRole('button', { name: /select country/i })).toHaveAccessibleName(/Albania/i);

  await sleep(300);
  // Ensure that input is in focus, input is tel type;
  await expect(getByLabelText(label)).toHaveFocus();
};

export const UncontrolledState: StoryFn<typeof PhoneNumberInput> = (): React.ReactElement => {
  return (
    <PhoneNumberInput
      label={label}
      defaultValue="9876543210"
      onChange={(e) => {
        onChangeFn(e);
      }}
    />
  );
};

UncontrolledState.play = async () => {
  onChangeFn.mockClear();
  const { getByLabelText } = within(document.body);

  await sleep(100);
  const input = getByLabelText(label);

  // Focus on input
  await userEvent.click(input);

  // Ensure default value is set
  await expect(input).toHaveValue('9876543210');

  // Type inside input
  await userEvent.clear(input);
  await userEvent.type(input, '1234567890');

  // Ensure the value of the input updates
  await expect(input).toHaveValue('1234567890');

  await expect(onChangeFn).toHaveBeenLastCalledWith(
    expect.objectContaining({
      country: 'IN',
      dialCode: '+91',
      name: undefined,
      phoneNumber: '1234 567890',
      value: '1234567890',
    }),
  );
};

export const ControlledState: StoryFn<typeof PhoneNumberInput> = (): React.ReactElement => {
  const [value, setValue] = React.useState('9876543210');
  return (
    <PhoneNumberInput
      label={label}
      value={value}
      onChange={(e) => {
        onChangeFn(e);
        setValue(e.value);
      }}
    />
  );
};

ControlledState.play = async () => {
  onChangeFn.mockClear();
  const { getByLabelText } = within(document.body);

  await sleep(100);
  const input = getByLabelText(label);

  // Focus on input
  await userEvent.click(input);

  // Ensure default value is set
  await expect(input).toHaveValue('9876543210');

  // Type inside input
  await userEvent.clear(input);
  await userEvent.type(input, '1234567890');

  // Ensure the value of the input updates
  await expect(input).toHaveValue('1234567890');

  await expect(onChangeFn).toHaveBeenLastCalledWith(
    expect.objectContaining({
      country: 'IN',
      dialCode: '+91',
      name: undefined,
      phoneNumber: '1234 567890',
      value: '1234567890',
    }),
  );
};

export const Disabled: StoryFn<typeof PhoneNumberInput> = (): React.ReactElement => {
  return <PhoneNumberInput isDisabled label={label} />;
};

Disabled.play = async () => {
  const { getByLabelText, getByRole } = within(document.body);

  await sleep(100);
  const input = getByLabelText(label);

  // Ensure the input is disabled
  await expect(input).toBeDisabled();
  // Ensure dropdown is disabled
  await expect(getByRole('button', { name: /select country/i })).toBeDisabled();

  // pressing tab should skip focus
  await userEvent.tab();
  await expect(input).not.toHaveFocus();
  await userEvent.tab();
  await expect(getByRole('button', { name: /select country/i })).not.toHaveFocus();
};

export const AutoFocus: StoryFn<typeof PhoneNumberInput> = (): React.ReactElement => {
  // eslint-disable-next-line jsx-a11y/no-autofocus
  return <PhoneNumberInput autoFocus label={label} />;
};

AutoFocus.play = async () => {
  const { getByLabelText } = within(document.body);

  await sleep(100);
  // Ensure the input is focused
  await expect(getByLabelText(label)).toHaveFocus();
};

export default {
  title: 'Components/Interaction Tests/PhoneNumberInput',
  parameters: {
    controls: {
      disable: true,
    },
    a11y: { disable: true },
    essentials: { disable: true },
    actions: { disable: true },
  },
};
