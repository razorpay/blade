import { CARD_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Card',
  description:
    'A surface around content; with onPress the whole card is one button. header, body and footer are padded sections with a hairline between them; raw children skip them.',
  argTypes: {
    variant: { control: 'select', options: CARD_AXES.variant },
    color: { control: 'select', options: CARD_AXES.color },
  },
  stories: {
    Basic: { args: { variant: 'primary' } },
    Pressable: {
      description:
        'onPress makes the card a button: hover, focus ring, press nudge, disabled.',
      argTypes: { isDisabled: { control: 'boolean' } },
      args: { isDisabled: false },
    },
  },
};

export default meta;
