import type { ComponentStory, Meta } from '@storybook/react';
import { Title, Subtitle, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import { Text } from '../Text';
import { Code as CodeComponent } from './Code';
import Box from '~components/Box';
import useMakeFigmaURL from '~src/_helpers/storybook/useMakeFigmaURL';
import FigmaEmbed from '~src/_helpers/storybook/FigmaEmbed';
import Sandbox from '~src/_helpers/storybook/Sandbox';

const Page = (): ReactElement => {
  const figmaURL = useMakeFigmaURL([
    {
      themeTokenName: 'paymentTheme',
      lightModeURL:
        'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=11770%3A147140',
      darkModeURL:
        'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=11770%3A147140',
    },
    {
      themeTokenName: 'bankingTheme',
      lightModeURL:
        'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=10344%3A189840',
      darkModeURL:
        'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=10344%3A189840',
    },
  ]);

  return (
    <>
      <Title />
      <Subtitle>
        Code component can be used for displaying token, variable names, or inlined code snippets.
      </Subtitle>
      <FigmaEmbed src={figmaURL} title="Heading Figma Designs" />
      <br />
      <br />
      <Title>Usage</Title>
      <Sandbox>
        {`
          import { Code, Text } from '@razorpay/blade/components';

          function App(): JSX.Element {
            return (
              // For React Native, you will have to use flex layout to align Code component properly
              <Text>You can use <Code>Code</Code> component to add inlined Code, token names, variable names, etc</Text>
            )
          }

          export default App;
        `}
      </Sandbox>
      <Title>Example</Title>
      <Primary />
      <Title>Properties</Title>
      <ArgsTable story={PRIMARY_STORY} />
      <Stories />
    </>
  );
};

const CodeStoryMeta: Meta = {
  title: 'Components/Typography/Code',
  component: CodeComponent,
  args: {
    size: 'small',
    children: 'SENTRY_AUTH_TOKEN',
  },
  parameters: {
    docs: {
      page: () => <Page />,
    },
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
