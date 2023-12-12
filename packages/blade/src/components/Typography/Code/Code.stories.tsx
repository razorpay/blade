import type { ComponentStory, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import { Text } from '../Text';
import { Code as CodeComponent } from './Code';
import BaseBox from '~components/Box/BaseBox';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="Code component can be used for displaying token, variable names, or inlined code snippets."
      componentName="Code"
      apiDecisionLink="https://github.com/razorpay/blade/blob/master/packages/blade/src/components/Typography/_decisions/decisions.md"
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=11770%3A147140',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=10344%3A189840',
      }}
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
          import { Code, Text } from '@razorpay/blade/components';

          function App(): React.ReactElement {
            return (
              // For React Native, you will have to use flex layout to align Code component properly
              <Text>You can use <Code>Code</Code> component to add inlined Code, token names, variable names, etc</Text>
            )
          }

          export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

const CodeStoryMeta: Meta = {
  title: 'Components/Typography/Code',
  component: CodeComponent,
  args: {
    size: 'small',
    weight: 'regular',
    children: 'SENTRY_AUTH_TOKEN',
    isHighlighted: true,
  },
  parameters: {
    docs: {
      page: () => <Page />,
    },
  },
  argTypes: getStyledPropsArgTypes(),
};

const CodeTemplate: ComponentStory<typeof CodeComponent> = (args) => (
  // For React Native, use flex to align items correctly
  <>
    <Text size="medium">
      Lorem ipsum normal text <CodeComponent {...args} size="medium" /> component
    </Text>
    <Text size="small">
      Lorem ipsum normal text <CodeComponent {...args} size="small" /> component
    </Text>
  </>
);

export default CodeStoryMeta;
export const Code = CodeTemplate.bind({});

export const WithBoldColor = CodeTemplate.bind({});
WithBoldColor.args = {
  color: 'feedback.positive.action.text.primary.default.lowContrast',
  isHighlighted: false,
  weight: 'bold',
};

export const SizeMedium = (): React.ReactElement => {
  return <CodeComponent size="medium">mediumCode</CodeComponent>;
};

export const SizeSmall = (): React.ReactElement => {
  return <CodeComponent size="small">smallCode</CodeComponent>;
};

export const NonHighlighted = CodeTemplate.bind({});
NonHighlighted.args = {
  isHighlighted: false,
};

export const ParagraphUse = (): React.ReactElement => {
  return (
    <>
      {/* For React Native, use flex to align items correctly */}
      <Text>
        Lorem ipsum normal text <CodeComponent>CODE</CodeComponent> component
      </Text>
      <BaseBox>
        <Text>
          Blade is Super Cool DS <CodeComponent>CODE</CodeComponent> component
        </Text>
      </BaseBox>
    </>
  );
};
