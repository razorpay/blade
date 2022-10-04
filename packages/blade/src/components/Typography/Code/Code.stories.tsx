import type { ComponentStory, Meta } from '@storybook/react';
import { Text } from '../Text';
import { Code as CodeComponent } from './Code';
import Box from '~components/Box';

const CodeStoryMeta: Meta = {
  title: 'Components/Typography/Code',
  component: CodeComponent,
  args: {
    size: 'small',
    children: 'SENTRY_AUTH_TOKEN',
  },
};

const CodeTemplate: ComponentStory<typeof CodeComponent> = (args) => (
  // For React Native, use flex to align items correctly
  <Text>
    Lorem ipsum normal text <CodeComponent {...args} /> component
  </Text>
);

export default CodeStoryMeta;
export const Code = CodeTemplate.bind({});

export const SizeMedium = (): JSX.Element => {
  return <CodeComponent size="medium">mediumCode</CodeComponent>;
};

export const SizeSmall = (): JSX.Element => {
  return <CodeComponent size="small">smallCode</CodeComponent>;
};

export const ParagraphUse = (): JSX.Element => {
  return (
    <>
      <Box>
        <Text>
          Lorem ipsum normal text <CodeComponent>CODE</CodeComponent> component
        </Text>
      </Box>
      <Box>
        <Text>
          Blade is Super Cool DS <CodeComponent>CODE</CodeComponent> component
        </Text>
      </Box>
    </>
  );
};
