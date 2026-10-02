import { OTP_INPUT_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'OTP input',
  description:
    'One-time-code component (packages/blade/components/otp-input) over the composite-input model: fixed cells, auto-advance, backspace retreat, paste and autofill distribution.',
  argTypes: {
    size: { control: 'select', options: OTP_INPUT_AXES.size },
    otpLength: { control: 'number', description: 'Fixed at mount' },
    label: { control: 'text' },
    helpText: { control: 'text' },
    inputMode: { control: 'select', options: ['numeric', 'text'] },
    isMasked: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    isReadOnly: { control: 'boolean' },
  },
  stories: {
    Basic: {
      description:
        'Type, paste, backspace and arrow between cells; every event the component reports is logged.',
      args: {
        size: 'medium',
        otpLength: 6,
        label: 'Enter OTP',
        helpText: 'Sent to your registered mobile',
        inputMode: 'numeric',
        isMasked: false,
        isDisabled: false,
        isReadOnly: false,
      },
    },
    Validation: {
      description:
        'Owned validation state: the consumer passes validationState and the matching text.',
      argTypes: {
        validationState: {
          control: 'select',
          options: ['none', 'error', 'success'],
        },
        helpText: { control: 'text' },
        errorText: { control: 'text' },
        successText: { control: 'text' },
      },
      args: {
        validationState: 'error',
        helpText: 'Sent to your registered mobile',
        errorText: 'Incorrect OTP, 2 attempts left',
      },
    },
    OutsideValue: {
      name: 'Outside value',
      description:
        'An auto-read (SMS) spreads a value over the cells without firing onChange or stealing focus.',
      argTypes: {},
    },
    InForm: {
      name: 'In a form',
      description:
        'A partial code fails the declarative pattern constraint, so the form blocks it; the full code submits under the field name.',
      argTypes: {},
    },
    Lengths: {
      description:
        'The cells share the row up to a fixed width, so any code length fits.',
      argTypes: {},
    },
  },
};

export default meta;
