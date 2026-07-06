import type { StoryFn, Meta } from '@storybook/react-vite';
import { Title } from '@storybook/addon-docs/blocks';
import type { TrustedMarkerProps } from './types';
import { TrustedMarker as TrustedMarkerComponent } from './TrustedMarker';
import BaseBox from '~components/Box/BaseBox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="TrustedMarker"
      componentDescription="A generic trust marker — a brand shield paired with a faded pill that displays a configurable trust label (default: 'Razorpay Trusted Business'). The component is designed to be generic so the label can evolve without a breaking API change."
      figmaURL="https://www.figma.com/design/fc7NbN38dG7olgm9mzpVx4/Checkout-DS?node-id=340-10923&m=dev"
    >
      <Title>Usage</Title>
      <BaseBox
        backgroundColor="surface.background.gray.intense"
        padding="spacing.5"
        borderRadius="medium"
      >
        <TrustedMarkerComponent variant="neutral" />
      </BaseBox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/TrustedMarker',
  component: TrustedMarkerComponent,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['full', 'icon'],
    },
    variant: {
      control: { type: 'select' },
      options: ['neutral', 'subtle'],
    },
    label: {
      control: { type: 'text' },
    },
    ...getStyledPropsArgTypes(),
  },
  args: {
    type: 'full',
    variant: 'neutral',
    label: 'Razorpay Trusted Business',
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<TrustedMarkerProps>;

const TrustedMarkerTemplate: StoryFn<typeof TrustedMarkerComponent> = (args) => {
  // The neutral variant uses static-white text, so render it over a dark surface for contrast.
  return (
    <BaseBox
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      borderRadius="medium"
      display="inline-flex"
    >
      <TrustedMarkerComponent {...args} />
    </BaseBox>
  );
};

export const Default = TrustedMarkerTemplate.bind({});

export const Neutral = TrustedMarkerTemplate.bind({});
Neutral.args = {
  variant: 'neutral',
};

export const Subtle: StoryFn<typeof TrustedMarkerComponent> = (args) => {
  // The subtle variant uses static-black text, so render it over a light surface for contrast.
  return (
    <BaseBox
      backgroundColor="surface.background.gray.subtle"
      padding="spacing.5"
      borderRadius="medium"
      display="inline-flex"
    >
      <TrustedMarkerComponent {...args} />
    </BaseBox>
  );
};
Subtle.args = {
  variant: 'subtle',
};

export const IconOnly = TrustedMarkerTemplate.bind({});
IconOnly.args = {
  type: 'icon',
};

export const CustomLabel = TrustedMarkerTemplate.bind({});
CustomLabel.args = {
  label: 'Razorpay Verified',
};
