import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Phone number input',
  description:
    'A TextInput for the national number with a country button that opens a dropdown of countries under the field, as Blade’s CountrySelector; an app may present the list its own way (`adapters.presentDropdown`). The value is the whole number with its dial code; the countries default to i18nify’s (`defaultPhoneCountries()`).',
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helpText: { control: 'text' },
    isDisabled: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    isCountryFixed: { control: 'boolean' },
    showDialCode: { control: 'boolean' },
    presentAsSheet: { control: 'boolean' },
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
        presentAsSheet: false,
      },
    },
    Allowed: {
      description:
        '`allowedCountries` narrows the picker; with one country left there is no picker at all.',
      argTypes: {},
    },
  },
};

export default meta;
