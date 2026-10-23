import { CARD_AXES } from '../../components/card';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Card',
  description:
    'Blade’s Card: a raised (or flat) surface, 24px in by default, composed from CardHeader, CardBody and CardFooter, as Blade React’s; the header and footer sit on hairlines. onClick or href lays a button or link over the card, so controls inside it stay usable.',
  argTypes: {
    variant: { control: 'select', options: CARD_AXES.variant },
    padding: { control: 'select', options: CARD_AXES.padding },
  },
  stories: {
    Basic: { args: { variant: 'primary', padding: 'spacing.7' } },
    Pressable: {
      description:
        'onClick lays a button over the card: the focus ring, the selected ring (isSelected), and disabled.',
      argTypes: { isDisabled: { control: 'boolean' } },
      args: { isDisabled: false },
    },
  },
};

export default meta;
