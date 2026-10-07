import { CARD_GROUP_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'CardGroup',
  description:
    'Header buttons over regions, driven by an items array. The open item is a field value, an item can be navigate-only, and a press can be vetoed — the three things the mobile home method list needs.',
  argTypes: {
    variant: { control: 'select', options: CARD_GROUP_AXES.variant },
    size: { control: 'select', options: CARD_GROUP_AXES.size },
    showNumberPrefix: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
  },
  stories: {
    Basic: {
      args: {
        variant: 'transparent',
        size: 'large',
        showNumberPrefix: false,
        isDisabled: false,
      },
    },
    PaymentMethods: {
      description:
        'The MobileHome shape: a default-open method, actionable methods that go to another screen, lazy content, a method facing issues whose press is vetoed, and an indicator swapped while details load.',
      args: { variant: 'transparent', size: 'large' },
      argTypes: {
        variant: { control: 'select', options: CARD_GROUP_AXES.variant },
        size: { control: 'select', options: CARD_GROUP_AXES.size },
      },
    },
    InForm: {
      description: 'With `name` and `isRequired` the open item is a required form value.',
      args: { variant: 'transparent', size: 'large' },
      argTypes: {
        variant: { control: 'select', options: CARD_GROUP_AXES.variant },
        size: { control: 'select', options: CARD_GROUP_AXES.size },
      },
    },
  },
};

export default meta;
