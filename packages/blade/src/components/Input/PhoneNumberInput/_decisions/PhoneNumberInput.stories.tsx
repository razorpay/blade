import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';

import type { PhoneNumberInputProps } from './types';
import { PhoneNumberInput } from './PhoneNumberInput';

const meta: Meta<PhoneNumberInputProps> = {
  title: 'Components/Input/PhoneNumberInput',
  component: PhoneNumberInput,
  tags: ['autodocs'],
};

const PhoneNumberInputTemplate: StoryFn<typeof PhoneNumberInput> = ({ ...args }) => {
  return <PhoneNumberInput {...args} />;
};

export const Default = PhoneNumberInputTemplate.bind({});

export default meta;
