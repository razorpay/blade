import type { StoryMeta } from '../types';

const INPUT_TYPES = ['text', 'tel', 'email', 'number', 'password'];

const meta: StoryMeta = {
  title: 'Text input',
  description:
    'Field component (packages/blade/components/text-input) over the input and field models; inside a Form it registers itself and mirrors its own error.',
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helpText: { control: 'text' },
    type: { control: 'select', options: INPUT_TYPES },
    isDisabled: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    isReadOnly: { control: 'boolean' },
    maxCharacters: { control: 'number' },
  },
  stories: {
    Basic: {
      args: {
        label: 'Full name',
        placeholder: 'As on your card',
        helpText: '',
        type: 'text',
        isDisabled: false,
        isRequired: false,
        isReadOnly: false,
      },
    },
    Validation: {
      description:
        "Owned validation state: the consumer passes validationState and Blade's three texts; the state picks its own, and helpText stands in for a missing one.",
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
        helpText: 'Your UPI ID, as name@bank',
        errorText: 'Enter a valid VPA',
        successText: 'VPA verified',
      },
    },
    Affixes: {
      description: 'leading / trailing take text or a snippet.',
      argTypes: {
        leading: { control: 'text' },
        trailing: { control: 'text' },
      },
      args: { leading: '', trailing: '@okaxis' },
    },
    Formatted: {
      description:
        'format.parse strips to digits, format.format groups in fours; the caret survives the rewrite. The expiry field uses declarative rule lists, which native runs in its own text pass.',
      argTypes: {
        maxCharacters: { control: 'number' },
      },
      args: { maxCharacters: 19 },
    },
    Textarea: {
      name: 'TextAreaInput',
      description:
        'The multi-line sibling: its own component over the same field glue and the text-input style parts.',
      argTypes: {
        label: { control: 'text' },
        placeholder: { control: 'text' },
        isDisabled: { control: 'boolean' },
      },
      args: {
        label: 'Delivery note',
        placeholder: 'Leave at the door',
        isDisabled: false,
      },
    },
  },
};

export default meta;
