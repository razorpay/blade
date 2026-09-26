import { HEADING_AXES, TEXT_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Typography',
  description:
    'Text and Heading are style-only: no behaviour model behind them (packages/blade/components/text, packages/blade/components/heading); the core only types the contract.',
  argTypes: {
    size: { control: 'select', options: TEXT_AXES.size },
    weight: { control: 'select', options: TEXT_AXES.weight },
    color: { control: 'select', options: TEXT_AXES.color },
    textAlign: { control: 'select', options: TEXT_AXES.textAlign },
    truncate: { control: 'select', options: TEXT_AXES.truncate },
    content: { control: 'text' },
  },
  stories: {
    Text: {
      args: {
        size: 'medium',
        weight: 'regular',
        color: 'default',
        textAlign: 'start',
        truncate: 'none',
        content:
          'Your card is saved as per RBI guidelines and is only ever charged with your consent. You can remove it at any time from the saved cards screen.',
      },
    },
    Heading: {
      argTypes: {
        size: { control: 'select', options: HEADING_AXES.size },
        weight: { control: 'select', options: HEADING_AXES.weight },
        color: { control: 'select', options: HEADING_AXES.color },
        textAlign: { control: 'select', options: HEADING_AXES.textAlign },
        content: { control: 'text' },
      },
      args: {
        size: 'medium',
        weight: 'semibold',
        color: 'default',
        textAlign: 'start',
        content: 'Payment options',
      },
    },
    Scale: {
      description: 'Every size of both components, generated from the axes.',
      argTypes: {},
    },
  },
};

export default meta;
