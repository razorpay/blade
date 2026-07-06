import type { StoryFn, Meta } from '@storybook/react-vite';
import { Title } from '@storybook/addon-docs/blocks';
import type { TrustBadgeProps } from './types';
import { TrustBadge as TrustBadgeComponent } from './TrustBadge';
import BaseBox from '~components/Box/BaseBox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="TrustBadge"
      componentDescription="A generic trust badge — a brand shield paired with a faded pill that displays a configurable trust label (default: 'Razorpay Trusted Business'). The component is designed to be generic so the label can evolve without a breaking API change."
      figmaURL="https://www.figma.com/design/fc7NbN38dG7olgm9mzpVx4/Checkout-DS?node-id=340-10923&m=dev"
    >
      <Title>Usage</Title>
      <BaseBox
        backgroundColor="surface.background.gray.subtle"
        padding="spacing.5"
        borderRadius="medium"
      >
        <TrustBadgeComponent />
      </BaseBox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/TrustBadge',
  component: TrustBadgeComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['full', 'icon-only'],
    },
    emphasis: {
      control: { type: 'select' },
      options: ['intense', 'subtle'],
    },
    label: {
      control: { type: 'text' },
    },
    ...getStyledPropsArgTypes(),
  },
  args: {
    variant: 'full',
    emphasis: 'subtle',
    label: 'Razorpay Trusted Business',
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<TrustBadgeProps>;

const TrustBadgeTemplate: StoryFn<typeof TrustBadgeComponent> = (args) => {
  const isSubtle = args.emphasis !== 'intense';
  return (
    <BaseBox
      backgroundColor={
        isSubtle ? 'surface.background.gray.subtle' : 'surface.background.gray.intense'
      }
      padding="spacing.5"
      borderRadius="medium"
      display="inline-flex"
    >
      <TrustBadgeComponent {...args} />
    </BaseBox>
  );
};

export const Default = TrustBadgeTemplate.bind({});

export const Intense = TrustBadgeTemplate.bind({});
Intense.args = {
  emphasis: 'intense',
};

export const Subtle: StoryFn<typeof TrustBadgeComponent> = (args) => {
  // The subtle variant uses static-black text, so render it over a light surface for contrast.
  return (
    <BaseBox
      backgroundColor="surface.background.gray.subtle"
      padding="spacing.5"
      borderRadius="medium"
      display="inline-flex"
    >
      <TrustBadgeComponent {...args} />
    </BaseBox>
  );
};
Subtle.args = {
  emphasis: 'subtle',
};

export const IconOnly = TrustBadgeTemplate.bind({});
IconOnly.args = {
  variant: 'icon-only',
};

export const CustomLabel = TrustBadgeTemplate.bind({});
CustomLabel.args = {
  label: 'Razorpay Verified',
};
