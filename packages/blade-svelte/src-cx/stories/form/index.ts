import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Form',
  description:
    'Form.svelte publishes the createForm model through context; fields register on it and buttons submit through it. The children snippet receives the live FormState.',
  stories: {
    Submit: {
      description:
        'Declarative constraints plus a custom validator, an async onSubmit, and the state snapshot the children snippet receives.',
      argTypes: {
        submitDelay: {
          control: 'number',
          description: 'Fake latency for onSubmit, in ms',
        },
      },
      args: { submitDelay: 1200 },
    },
    EnterKey: {
      name: 'Enter-key submission',
      description:
        'Enter in a field submits through the form model; the submit button mirrors the busy state it never pressed into.',
    },
  },
};

export default meta;
