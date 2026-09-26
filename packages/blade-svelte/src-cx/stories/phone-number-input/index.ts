import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Phone number input',
  description:
    'A TextInput for the national number with a country button that opens a bottom-sheet picker (Modal + virtualised OptionList). The value is the whole number with its dial code; the app supplies the countries.',
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helpText: { control: 'text' },
    isDisabled: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    isCountryFixed: { control: 'boolean' },
    showDialCode: { control: 'boolean' },
    withSearch: { control: 'boolean' },
  },
  stories: {
    Basic: {
      args: {
        label: 'Mobile number',
        placeholder: 'Mobile number',
        helpText: '',
        isDisabled: false,
        isRequired: false,
        isCountryFixed: false,
        showDialCode: true,
        withSearch: true,
      },
    },
    Allowed: {
      description:
        '`allowedCountries` narrows the picker; with one country left there is no picker at all.',
      argTypes: {},
    },
    InForm: {
      description:
        'Inside a Form the field validates the national number against the country pattern and submits the whole number.',
      argTypes: {},
    },
  },
};

export default meta;
