import { CODE_AXES, DISPLAY_AXES, HEADING_AXES, TEXT_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Typography',
  description:
    "Text, Heading, Display and Code: Blade DSL's text styles (Figma), style-only, with no behaviour model behind them.",
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
    Display: {
      description: 'The hero sizes above Heading: 48 to 72px in the heading face.',
      argTypes: {
        size: { control: 'select', options: DISPLAY_AXES.size },
        weight: { control: 'select', options: DISPLAY_AXES.weight },
        color: { control: 'select', options: DISPLAY_AXES.color },
        textAlign: { control: 'select', options: DISPLAY_AXES.textAlign },
        content: { control: 'text' },
      },
      args: {
        size: 'small',
        weight: 'semibold',
        color: 'default',
        textAlign: 'start',
        content: 'Accept payments',
      },
    },
    Code: {
      description: 'Inline code in a line of Text: a neutral chip by default, plain with isHighlighted off.',
      argTypes: {
        size: { control: 'select', options: CODE_AXES.size },
        weight: { control: 'select', options: CODE_AXES.weight },
        isHighlighted: { control: 'boolean' },
        content: { control: 'text' },
      },
      args: { size: 'medium', weight: 'regular', isHighlighted: true, content: 'RAZORPAY_KEY_ID' },
    },
    Scale: {
      description: 'Every size of each component, generated from the axes.',
      argTypes: {},
    },
  },
};

export default meta;
