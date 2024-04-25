/* eslint-disable @typescript-eslint/no-explicit-any */
import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import { PhoneNumberInput } from '../PhoneNumberInput';
import type { PhoneNumberInputProps } from '../types';

export default {
  title: 'Components/E2E Tests/PhoneNumberInput',
  component: PhoneNumberInput,
} as Meta<PhoneNumberInputProps>;

const label = 'Phone Number';

export const SelectACountry: StoryFn<typeof PhoneNumberInput> = (): React.ReactElement => {
  return <PhoneNumberInput label={label} />;
};

export const UncontrolledState: StoryFn<typeof PhoneNumberInput> = (): React.ReactElement => {
  return (
    <PhoneNumberInput
      label={label}
      defaultValue="9876543210"
      onChange={(data) => {
        (window as any).onChangeData = data;
      }}
    />
  );
};

export const ControlledState: StoryFn<typeof PhoneNumberInput> = (): React.ReactElement => {
  const [value, setValue] = React.useState('9876543210');
  return (
    <PhoneNumberInput
      label={label}
      value={value}
      onChange={(data) => {
        (window as any).onChangeData = data;
        setValue(data.value);
      }}
    />
  );
};

export const Disabled: StoryFn<typeof PhoneNumberInput> = (): React.ReactElement => {
  return <PhoneNumberInput isDisabled label={label} />;
};

export const AutoFocus: StoryFn<typeof PhoneNumberInput> = (): React.ReactElement => {
  // eslint-disable-next-line jsx-a11y/no-autofocus
  return <PhoneNumberInput autoFocus label={label} />;
};
