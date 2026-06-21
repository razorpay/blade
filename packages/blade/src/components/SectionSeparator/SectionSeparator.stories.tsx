import type { StoryFn, Meta } from '@storybook/react-vite';
import type { SectionSeparatorProps } from './SectionSeparator';
import { SectionSeparator as SectionSeparatorComponent } from './SectionSeparator';
import { Heading } from '~components/Typography/Heading';
import { Box } from '~components/Box';
import { Text } from '~components/Typography/Text';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="SectionSeparator"
      componentDescription="SectionSeparator is a visual element that combines a section label with a gradient line that fades to transparent, creating a clear and elegant section delineation in layouts."
      apiDecisionLink={null}
      figmaURL={null}
    >
      <Heading size="large">Usage</Heading>
      <Sandbox>
        {`
          import { SectionSeparator, Box, Text } from "@razorpay/blade/components";

          function App() {
            return (
              <Box display="flex" flexDirection="column" gap="spacing.4">
                <SectionSeparator label="Payment Details" />
                <Text>Your payment information goes here.</Text>
                <SectionSeparator label="Billing Address" />
                <Text>Billing information goes here.</Text>
              </Box>
            );
          }
          export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/SectionSeparator',
  component: SectionSeparatorComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: ['normal', 'subtle', 'muted'],
      control: { type: 'select' },
    },
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<SectionSeparatorProps>;

const DefaultTemplate: StoryFn<typeof SectionSeparatorComponent> = (args) => (
  <Box padding="spacing.5" maxWidth="500px">
    <SectionSeparatorComponent {...args} />
  </Box>
);

export const Default = DefaultTemplate.bind({});
Default.storyName = 'Default';
Default.args = {
  label: 'Section Title',
  variant: 'muted',
};

const VariantsTemplate: StoryFn<typeof SectionSeparatorComponent> = () => (
  <Box padding="spacing.5" maxWidth="500px" display="flex" flexDirection="column" gap="spacing.6">
    <Box>
      <Text size="small" marginBottom="spacing.2">Normal</Text>
      <SectionSeparatorComponent label="Payment Details" variant="normal" />
    </Box>
    <Box>
      <Text size="small" marginBottom="spacing.2">Subtle</Text>
      <SectionSeparatorComponent label="Payment Details" variant="subtle" />
    </Box>
    <Box>
      <Text size="small" marginBottom="spacing.2">Muted (default)</Text>
      <SectionSeparatorComponent label="Payment Details" variant="muted" />
    </Box>
    <Box>
      <Text size="small" marginBottom="spacing.2">No label</Text>
      <SectionSeparatorComponent variant="muted" />
    </Box>
  </Box>
);

export const Variants = VariantsTemplate.bind({});
Variants.storyName = 'Variants';

const InContextTemplate: StoryFn<typeof SectionSeparatorComponent> = () => (
  <Box padding="spacing.6" maxWidth="480px" display="flex" flexDirection="column" gap="spacing.4">
    <SectionSeparatorComponent label="Personal Info" />
    <Text>Name: Razorpay User</Text>
    <Text>Email: user@razorpay.com</Text>
    <SectionSeparatorComponent label="Payment Method" />
    <Text>Card ending in 4242</Text>
    <SectionSeparatorComponent label="Billing Address" />
    <Text>Mumbai, Maharashtra, India</Text>
  </Box>
);

export const InContext = InContextTemplate.bind({});
InContext.storyName = 'In Context';
