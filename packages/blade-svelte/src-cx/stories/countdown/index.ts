import { COUNTDOWN_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Countdown',
  description:
    'A timer over createCountdownClock: it counts against the wall clock, so a throttled background tab still shows the truth.',
  argTypes: {
    variant: { control: 'select', options: COUNTDOWN_AXES.variant },
    seconds: { control: 'number' },
    urgentBelow: { control: 'number' },
    isPaused: { control: 'boolean' },
  },
  stories: {
    Basic: {
      args: { variant: 'pill', seconds: 20, urgentBelow: 10, isPaused: false },
    },
  },
};

export default meta;
