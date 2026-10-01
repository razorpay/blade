/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable import/no-extraneous-dependencies */
import type { StoryFn } from '@storybook/react-vite';
import { within, userEvent, expect, fn } from 'storybook/test';
import React from 'react';
import { PhoneNumberInput } from '../PhoneNumberInput';

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const label = 'Phone Number';
const onChangeFn = fn();
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

  // Search is auto-focused on open; arrow-down moves focus into the list
  await userEvent.keyboard('{arrowdown}');
  await userEvent.keyboard('{arrowdown}');

  // Select the focused country
  await userEvent.keyboard('{enter}');
  await sleep(300);

  // Ensure the country selector is closed
  await expect(queryByRole('menu')).not.toBeInTheDocument();

  // expect albania to be selected
  await expect(getByRole('button', { name: /select country/i })).toHaveAccessibleName(
    /Åland Islands - Select Country/i,
  );

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

  const expectedValue = {
    country: 'IN',
    dialCode: '+91',
    name: undefined,
    phoneNumber: '1234 567890',
    value: '1234567890',
  };

  const actualValue = onChangeFn.mock.lastCall?.[0];
  await expect(actualValue).toEqual(expectedValue);
};

export const ControlledStateFocusAndDefaultValue: StoryFn<
  typeof PhoneNumberInput
> = (): React.ReactElement => {
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

ControlledStateFocusAndDefaultValue.play = async () => {
  await sleep(1000);

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

  await sleep(100);

  await userEvent.type(input, '1234567890');

  await expect(input).toHaveValue('1234567890');

  const expectedValue = {
    country: 'IN',
    dialCode: '+91',
    name: undefined,
    phoneNumber: '1234 567890',
    value: '1234567890',
  };
  const actualValue = onChangeFn.mock.lastCall?.[0];
  await expect(actualValue).toEqual(expectedValue);
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

export const SearchByCountryName: StoryFn<typeof PhoneNumberInput> = (): React.ReactElement => {
  return <PhoneNumberInput label={label} allowedCountries={['IN', 'US', 'GB', 'AU', 'DE']} />;
};

SearchByCountryName.play = async () => {
  const { getByRole, queryByRole, getByLabelText } = within(document.body);

  await sleep(100);

  // Open the country selector
  await userEvent.click(getByRole('button', { name: /select country/i }));
  await sleep(300);

  // Search input should be visible
  const searchInput = getByRole('textbox', { name: /search countries/i });
  await expect(searchInput).toBeVisible();

  // Type a country name
  await userEvent.type(searchInput, 'germany');
  await sleep(200);

  // Germany should be visible, India should not
  await expect(getByRole('menuitem', { name: /germany/i })).toBeInTheDocument();
  await expect(queryByRole('menuitem', { name: /india/i })).not.toBeInTheDocument();

  // Select Germany
  await userEvent.click(getByRole('menuitem', { name: /germany/i }));
  await sleep(300);

  // Dropdown should close
  await expect(queryByRole('textbox', { name: /search countries/i })).not.toBeInTheDocument();

  // Country selector button should reflect Germany (+49)
  await expect(getByRole('button', { name: /germany - select country/i })).toBeInTheDocument();

  // Focus should return to the phone input
  await expect(getByLabelText(label)).toHaveFocus();
};

export const SearchByDialCode: StoryFn<typeof PhoneNumberInput> = (): React.ReactElement => {
  return <PhoneNumberInput label={label} allowedCountries={['IN', 'US', 'GB', 'AU', 'DE']} />;
};

SearchByDialCode.play = async () => {
  const { getByRole, queryByRole } = within(document.body);

  await sleep(100);

  // Open the country selector
  await userEvent.click(getByRole('button', { name: /select country/i }));
  await sleep(300);

  const searchInput = getByRole('textbox', { name: /search countries/i });

  // Search by dial code with "+" prefix (India = +91)
  await userEvent.type(searchInput, '+91');
  await sleep(200);

  await expect(getByRole('menuitem', { name: /india/i })).toBeInTheDocument();
  await expect(queryByRole('menuitem', { name: /germany/i })).not.toBeInTheDocument();
};

export const SearchResetOnClose: StoryFn<typeof PhoneNumberInput> = (): React.ReactElement => {
  return <PhoneNumberInput label={label} allowedCountries={['IN', 'US', 'GB', 'AU', 'DE']} />;
};

SearchResetOnClose.play = async () => {
  const { getByRole, queryByRole } = within(document.body);

  await sleep(100);

  // Open, type, then close
  await userEvent.click(getByRole('button', { name: /select country/i }));
  await sleep(300);

  const searchInput = getByRole('textbox', { name: /search countries/i });
  await userEvent.type(searchInput, 'india');
  await sleep(200);
  await expect(getByRole('menuitem', { name: /india/i })).toBeInTheDocument();

  // Close via Escape
  await userEvent.keyboard('{Escape}');
  await sleep(300);

  // Reopen
  await userEvent.click(getByRole('button', { name: /select country/i }));
  await sleep(300);

  // Search should be cleared — all allowed countries should appear
  const reopenedSearch = getByRole('textbox', { name: /search countries/i });
  await expect(reopenedSearch).toHaveValue('');
  await expect(getByRole('menuitem', { name: /india/i })).toBeInTheDocument();
  await expect(getByRole('menuitem', { name: /germany/i })).toBeInTheDocument();
  await expect(queryByRole('menuitem', { name: /zzzznotacountry/i })).not.toBeInTheDocument();
};

export default {
  title: 'Components/Interaction Tests/PhoneNumberInput',
  parameters: {
    controls: {
      disable: true,
    },
    a11y: { disable: true },
    essentials: { disable: true },
  },
};
