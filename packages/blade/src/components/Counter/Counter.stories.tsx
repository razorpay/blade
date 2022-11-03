import type { ComponentStory, Meta } from '@storybook/react';
import { Title, Subtitle, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import { Highlight, Link } from '@storybook/design-system';
import type { ReactElement } from 'react';
import type { CounterProps } from './Counter';
import { Counter as CounterComponent } from './Counter';
import Box from '~components/Box';
import { Text as BladeText } from '~components/Typography';
import useMakeFigmaURL from '~src/_helpers/storybook/useMakeFigmaURL';

const Page = (): ReactElement => {
  const figmaURL = useMakeFigmaURL([
    {
      themeTokenName: 'paymentTheme',
      lightModeURL:
        'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=8222%3A70827',
      darkModeURL:
        'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=8222%3A70827',
    },
    {
      themeTokenName: 'bankingTheme',
      lightModeURL:
        'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=8222%3A70827',
      darkModeURL:
        'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=8222%3A70827',
    },
  ]);

  return (
    <>
      <Title />
      <Subtitle>
        Counters are visual indicators that contains numerical values, tallies or counts in regards
        to some context. It can be used to show non-interactive numerical data.
      </Subtitle>
      <Link withArrow={true} href={figmaURL} target="_blank" rel="noreferrer noopener">
        View in Figma
      </Link>
      <br />
      <br />
      <Title>Usage</Title>
      <Highlight language="tsx">{`import { Counter } from '@razorpay/blade/components'; \nimport type { CounterProps } from '@razorpay/blade/components';`}</Highlight>
      <Title>Example</Title>
      <Subtitle>
        This is the default Counter. You can change the properties of this button using the controls
        in the table below.
      </Subtitle>
      <Primary />
      <Title>Properties</Title>
      <ArgsTable story={PRIMARY_STORY} />
      <Stories />
    </>
  );
};

export default {
  title: 'Components/Counter',
  component: CounterComponent,
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<CounterProps>;

const CounterTemplate: ComponentStory<typeof CounterComponent> = ({ ...args }) => {
  return <CounterComponent {...args} />;
};

export const Counter = CounterTemplate.bind({});
Counter.args = {
  value: 20,
  intent: 'neutral',
  contrast: 'low',
};
Counter.storyName = 'Default';

export const Max = CounterTemplate.bind({});
Max.args = {
  value: 120,
  max: 99,
  intent: 'neutral',
  contrast: 'high',
};
Max.storyName = 'Max';

const CountersWithVariantTemplate: ComponentStory<typeof CounterComponent> = ({ ...args }) => {
  const intents = ['positive', 'negative', 'notice', 'information', 'neutral'] as const;

  return (
    <Box display="flex" flexDirection="column">
      <BladeText>Low Contrast</BladeText>
      <Box
        display="flex"
        flexDirection="row"
        paddingTop="spacing.3"
        paddingBottom="spacing.5"
        flexWrap="wrap"
      >
        {intents.map((intent) => (
          <Box key={intent} paddingRight="spacing.3" paddingTop="spacing.2">
            <CounterComponent {...args} intent={intent} contrast="low" />
          </Box>
        ))}
      </Box>
      <BladeText>High Contrast</BladeText>
      <Box
        display="flex"
        flexDirection="row"
        paddingTop="spacing.3"
        paddingBottom="spacing.5"
        flexWrap="wrap"
      >
        {intents.map((intent) => (
          <Box key={intent} paddingRight="spacing.3" paddingTop="spacing.2">
            <CounterComponent {...args} intent={intent} contrast="high" />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export const CounterSmallSize = CountersWithVariantTemplate.bind({});
CounterSmallSize.args = {
  value: 20,
  size: 'small',
};
CounterSmallSize.storyName = 'Small Size';

export const CounterMediumSize = CountersWithVariantTemplate.bind({});
CounterMediumSize.args = {
  value: 20,
  size: 'medium',
};
CounterMediumSize.storyName = 'Medium Size';
