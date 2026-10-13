import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Adapters',
  description:
    'provideAdapters is the injection seam for app services (analytics, haptics, error capture, field reveal). Every adapter is optional; components run on no-op defaults without one.',
  stories: {
    Seam: {
      name: 'Every adapter wired',
      description:
        'A long form whose adapters log to the panel below: submit tracking, field-change tracking, haptics on a blocked press, and revealField focusing the first invalid field.',
    },
  },
};

export default meta;
