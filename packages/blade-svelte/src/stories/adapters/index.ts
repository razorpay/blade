import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Adapters',
  description:
    "BladeProvider's adapters prop is the injection seam for app services (analytics, haptics, announcements, locale, error capture, the form, router). Every adapter is optional; components run on no-op defaults without one.",
  stories: {
    Seam: {
      name: 'Every adapter wired',
      description:
        'Fields, a button and a link whose adapters log to the panel beside them: field-change tracking, haptics on a press, and navigate taking an internal link.',
    },
  },
};

export default meta;
