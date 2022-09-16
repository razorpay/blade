import type { ComponentStory, Meta } from '@storybook/react';
import { Code } from './Code';

const TextStoryMeta: Meta = {
  title: 'Components/Typography/Code',
  component: Code,
  args: {
    variant: 'body',
    weight: 'regular',
    size: 'medium',
    type: 'normal',
    children: 'SENTRY_AUTH_TOKEN',
    truncateAfterLines: 3,
    contrast: 'low',
  },
};

const CodeTemplate: ComponentStory<typeof Code> = (args) => {
  return <Code {...args}>{args.children}</Code>;
};

export default TextStoryMeta;
export const CodeExport = CodeTemplate.bind({});
