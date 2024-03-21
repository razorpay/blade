/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable import/no-extraneous-dependencies */
import type { StoryFn } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import { expect, jest } from '@storybook/jest';
import React from 'react';
import { PhoneNumberInput } from '../PhoneNumberInput';

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const onChangeFn = jest.fn();
export const SelectACountry: StoryFn<typeof PhoneNumberInput> = (): React.ReactElement => {
  return <PhoneNumberInput />;
};

SelectACountry.play = async () => {
  const { queryByRole, getByRole } = within(document.body);

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
  // Ensure that input is in focus
  await expect(getByRole('spinbutton')).toHaveFocus();
};

export const UncontrolledState: StoryFn<typeof PhoneNumberInput> = (): React.ReactElement => {
  return (
    <PhoneNumberInput
      defaultValue="9876543210"
      onChange={(e) => {
        onChangeFn(e);
      }}
    />
  );
};

UncontrolledState.play = async () => {
  onChangeFn.mockClear();
  const { getByRole } = within(document.body);

  await sleep(100);
  // Focus on input
  await userEvent.click(getByRole('spinbutton'));

  // Ensure default value is set
  await expect(getByRole('spinbutton')).toHaveValue(9876543210);

  // Type inside input
  await userEvent.clear(getByRole('spinbutton'));
  await userEvent.type(getByRole('spinbutton'), '1234567890');

  // Ensure the value of the input updates
  await expect(getByRole('spinbutton')).toHaveValue(1234567890);

  await expect(onChangeFn).toHaveBeenLastCalledWith(
    expect.objectContaining({
      countryCode: 'IN',
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
  const { getByRole } = within(document.body);

  await sleep(100);
  // Focus on input
  await userEvent.click(getByRole('spinbutton'));

  // Ensure default value is set
  await expect(getByRole('spinbutton')).toHaveValue(9876543210);

  // Type inside input
  await userEvent.clear(getByRole('spinbutton'));
  await userEvent.type(getByRole('spinbutton'), '1234567890');

  // Ensure the value of the input updates
  await expect(getByRole('spinbutton')).toHaveValue(1234567890);

  await expect(onChangeFn).toHaveBeenLastCalledWith(
    expect.objectContaining({
      countryCode: 'IN',
      dialCode: '+91',
      name: undefined,
      phoneNumber: '1234 567890',
      value: '1234567890',
    }),
  );
};

export const Disabled: StoryFn<typeof PhoneNumberInput> = (): React.ReactElement => {
  return <PhoneNumberInput isDisabled />;
};

Disabled.play = async () => {
  const { getByRole } = within(document.body);

  await sleep(100);
  // Ensure the input is disabled
  await expect(getByRole('spinbutton')).toBeDisabled();
  // Ensure dropdown is disabled
  await expect(getByRole('button', { name: /select country/i })).toBeDisabled();

  // pressing tab should skip focus
  await userEvent.tab();
  await expect(getByRole('spinbutton')).not.toHaveFocus();
  await userEvent.tab();
  await expect(getByRole('button', { name: /select country/i })).not.toHaveFocus();
};

export const AutoFocus: StoryFn<typeof PhoneNumberInput> = (): React.ReactElement => {
  // eslint-disable-next-line jsx-a11y/no-autofocus
  return <PhoneNumberInput autoFocus />;
};

AutoFocus.play = async () => {
  const { getByRole } = within(document.body);

  await sleep(100);
  // Ensure the input is focused
  await expect(getByRole('spinbutton')).toHaveFocus();
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
