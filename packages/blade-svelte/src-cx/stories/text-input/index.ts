import { TEXT_INPUT_AXES } from '../../index';
import type { StoryMeta } from '../types';

const INPUT_TYPES = ['text', 'tel', 'email', 'url', 'number'];

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
    size: { control: 'select', options: TEXT_INPUT_AXES.size },
    textAlign: { control: 'select', options: TEXT_INPUT_AXES.textAlign },
    necessityIndicator: { control: 'select', options: ['none', 'required', 'optional'] },
    showClearButton: { control: 'boolean' },
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
        size: 'medium',
        textAlign: 'left',
        necessityIndicator: 'none',
        showClearButton: false,
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
    LabelArea: {
      description:
        "`labelArea` places the label among other content — Blade's labelSuffix (an info tooltip) and labelTrailing (a link, pushed to the end with `ms-auto`). Only the label names the control.",
      argTypes: {},
    },
    Affixes: {
      description:
        "Figma's slots: leadingIcon, prefix, the leading selector snippet; suffix, trailingIcon, the trailing link snippet. Each kind keeps its own inset and gap.",
      argTypes: {
        prefix: { control: 'text' },
        suffix: { control: 'text' },
      },
      args: { prefix: '', suffix: '@okaxis' },
    },
    Formatted: {
      description:
        'format.parse strips to digits, format.format groups in fours; the caret survives the rewrite. The expiry field uses declarative rule lists, which native runs in its own text pass.',
      argTypes: {
        maxCharacters: { control: 'number' },
      },
      args: { maxCharacters: 19 },
    },
    PasswordInput: {
      description:
        "Blade's PasswordInput over TextInput: masked, never autocapitalized, with a button that reveals the text (none while disabled).",
      argTypes: {
        label: { control: 'text' },
        placeholder: { control: 'text' },
        helpText: { control: 'text' },
        isDisabled: { control: 'boolean' },
        showRevealButton: { control: 'boolean' },
        necessityIndicator: { control: 'select', options: ['none', 'required'] },
        autoComplete: {
          control: 'select',
          options: ['current-password', 'new-password', 'off'],
        },
        size: { control: 'select', options: ['medium', 'large'] },
      },
      args: {
        label: 'Password',
        placeholder: 'Enter your password',
        helpText: '',
        isDisabled: false,
        showRevealButton: true,
        necessityIndicator: 'none',
        autoComplete: 'current-password',
        size: 'medium',
      },
    },
    SearchInput: {
      description:
        "Blade's SearchInput over TextInput: a searchbox led by the search glyph, with the clear button while it holds text and the keyboard's search key.",
      argTypes: {
        label: { control: 'text' },
        placeholder: { control: 'text' },
        helpText: { control: 'text' },
        isDisabled: { control: 'boolean' },
        showSearchIcon: { control: 'boolean' },
        size: { control: 'select', options: ['medium', 'large'] },
      },
      args: {
        label: '',
        placeholder: 'Search banks',
        helpText: '',
        isDisabled: false,
        showSearchIcon: true,
        size: 'medium',
      },
    },
    Textarea: {
      name: 'TextArea',
      description:
        'The multi-line sibling: its own component over the same field glue and the text-input style parts.',
      argTypes: {
        label: { control: 'text' },
        placeholder: { control: 'text' },
        helpText: { control: 'text' },
        isDisabled: { control: 'boolean' },
        showClearButton: { control: 'boolean' },
        numberOfLines: { control: 'number' },
        maxCharacters: { control: 'number' },
        size: { control: 'select', options: ['medium', 'large'] },
      },
      args: {
        label: 'Delivery note',
        placeholder: 'Leave at the door',
        helpText: 'Help',
        isDisabled: false,
        showClearButton: true,
        numberOfLines: 2,
        maxCharacters: 100,
        size: 'medium',
      },
    },
  },
};

export default meta;
