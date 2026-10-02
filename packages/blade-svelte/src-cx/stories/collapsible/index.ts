import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Collapsible',
  description:
    "Blade's Collapsible: a trigger (a Button or a Link-looking Button) that shows and hides a body, which slides open under it — or above it, with direction=\"top\".",
  argTypes: {
    direction: { control: 'select', options: ['bottom', 'top'] },
  },
  stories: {
    WithButton: {
      name: 'With a Button',
      description: "Blade's WithCollapsibleButton story.",
      args: { direction: 'bottom' },
    },
    WithLink: {
      name: 'With a link',
      description:
        "Blade's WithCollapsibleLink story: a Link variant=\"button\" with a CollapsibleChevron, which flips while expanded.",
      args: { direction: 'bottom' },
    },
    Controlled: {
      description: 'bind:isExpanded: driven from outside as well as by its trigger.',
      argTypes: {},
    },
  },
};

export default meta;
