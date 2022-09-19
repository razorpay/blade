import type { ComponentStory, Meta } from '@storybook/react';
import { Text } from '../Text';
import { Code as CodeComponent } from './Code';

const CodeStoryMeta: Meta = {
  title: 'Components/Typography/Code',
  component: CodeComponent,
  args: {
    size: 'medium',
    type: 'subtle',
    children: 'SENTRY_AUTH_TOKEN',
  },
};

const CodeTemplate: ComponentStory<typeof CodeComponent> = (args) => (
  <Text>
    Lorem ipsum normal text <CodeComponent {...args} /> something something
    <br />
    also something something else lorem ipsum
  </Text>
);

export default CodeStoryMeta;
export const Code = CodeTemplate.bind({});
