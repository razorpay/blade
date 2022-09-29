import type { ComponentStory, Meta } from '@storybook/react';
import { Text } from '../Text';
import { Code as CodeComponent } from './Code';
import type { CodeProps } from './Code';
import { textTypes } from './testing-utils/CodeTypesContainer';
import Box from '~components/Box';

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
  // For React Native, use flex to align items correctly
  <Text>
    Lorem ipsum normal text <CodeComponent {...args} /> component
  </Text>
);

export default CodeStoryMeta;
export const Code = CodeTemplate.bind({});

const CodeTypeKitchenSink = ({
  type,
  size,
}: {
  type: CodeProps['type'];
  size: CodeProps['size'];
}): JSX.Element => {
  return (
    <Box key={type} paddingTop="spacing.2">
      <Text>
        This{' '}
        <CodeComponent type={type} size={size}>
          {'<Code />'}
        </CodeComponent>{' '}
        is {type}
      </Text>
    </Box>
  );
};

export const SizeMedium = (): JSX.Element[] => {
  return textTypes.map((codeType) => (
    <CodeTypeKitchenSink key={codeType} type={codeType} size="medium" />
  ));
};

export const SizeLarge = (): JSX.Element[] => {
  return textTypes.map((codeType) => (
    <CodeTypeKitchenSink key={codeType} type={codeType} size="large" />
  ));
};
