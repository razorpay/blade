import type { ComponentStory, Meta } from '@storybook/react';
import { Title, Subtitle, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import { Highlight, Link } from '@storybook/design-system';
import type { ReactElement } from 'react';
import type { SpinnerProps } from './Spinner';
import { Spinner as SpinnerComponent } from './Spinner';
import useMakeFigmaURL from '~src/_helpers/storybook/useMakeFigmaURL';
import Box from '~components/Box';
import { Text } from '~components/Typography';

const Page = (): ReactElement => {
  const figmaURL = useMakeFigmaURL([
    {
      themeTokenName: 'paymentTheme',
      lightModeURL:
        'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=14825%3A203592',
      darkModeURL:
        'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=14825%3A203592',
    },
    {
      themeTokenName: 'bankingTheme',
      lightModeURL:
        'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=11506%3A284715',
      darkModeURL:
        'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=11506%3A284715',
    },
  ]);

  return (
    <>
      <Title />
      <Subtitle>
        A spinner is an element with a looping animation that indicates loading is in process.
      </Subtitle>
      <Link withArrow={true} href={figmaURL} target="_blank" rel="noreferrer noopener">
        View in Figma
      </Link>
      <br />
      <br />
      <Title>Usage</Title>
      <Highlight language="tsx">{`import { Spinner } from '@razorpay/blade/components'; \nimport type { SpinnerProps } from '@razorpay/blade/components';`}</Highlight>
      <Title>Example</Title>
      <Subtitle>
        This is the default spinner. You can change the properties of this spinner using the
        controls in the table below.
      </Subtitle>
      <Primary />
      <Title>Properties</Title>
      <ArgsTable story={PRIMARY_STORY} />
      <Stories />
    </>
  );
};

export default {
  title: 'Components/Spinner',
  component: SpinnerComponent,
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<SpinnerProps>;

const SpinnerTemplate: ComponentStory<typeof SpinnerComponent> = ({ ...args }) => {
  return <SpinnerComponent {...args} />;
};

export const Spinner = SpinnerTemplate.bind({});
Spinner.storyName = 'Default';

const SpinnerSizesTemplate: ComponentStory<typeof SpinnerComponent> = ({ ...args }) => {
  return (
    <Box>
      <Box marginBottom="spacing.3">
        <Text>Small</Text>
        <Box marginBottom="spacing.2" />
        <SpinnerComponent {...args} size="small" />
      </Box>
      <Box marginBottom="spacing.3">
        <Text>Medium</Text>
        <Box marginBottom="spacing.2" />
        <SpinnerComponent {...args} size="medium" />
      </Box>
      <Box marginBottom="spacing.3">
        <Text>Large</Text>
        <Box marginBottom="spacing.2" />
        <SpinnerComponent {...args} size="large" />
      </Box>
    </Box>
  );
};

export const SpinnerSizes = SpinnerSizesTemplate.bind({});
SpinnerSizes.storyName = 'Sizes';

const SpinnerContrastTemplate: ComponentStory<typeof SpinnerComponent> = ({ ...args }) => {
  return (
    <Box>
      <Box marginBottom="spacing.3">
        <Text>Low Contrast</Text>
        <Box marginBottom="spacing.2" />
        <SpinnerComponent {...args} contrast="low" />
      </Box>
      <Box marginBottom="spacing.3">
        <Text>High Contrast</Text>
        <Box marginBottom="spacing.2" />
        <SpinnerComponent {...args} contrast="high" />
      </Box>
    </Box>
  );
};

export const SpinnerContrasts = SpinnerContrastTemplate.bind({});
SpinnerContrasts.storyName = 'Contrasts';
