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
      componentDescription="A generic trust badge — a brand shield paired with a sea-tinted pill that displays a configurable trust label (default: 'Razorpay Trusted Business'). The component is designed to be generic so the label can evolve without a breaking API change."
      figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=123352-128035&m=dev"
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
      options: ['default', 'icon-only'],
    },
    label: {
      control: { type: 'text' },
    },
    ...getStyledPropsArgTypes(),
  },
  args: {
    variant: 'default',
    label: 'Razorpay Trusted Business',
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<TrustBadgeProps>;

const TrustBadgeTemplate: StoryFn<typeof TrustBadgeComponent> = (args) => {
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

export const Default = TrustBadgeTemplate.bind({});

export const IconOnly = TrustBadgeTemplate.bind({});
IconOnly.args = {
  variant: 'icon-only',
};

export const CustomLabel = TrustBadgeTemplate.bind({});
CustomLabel.args = {
  label: 'Razorpay Verified',
};
