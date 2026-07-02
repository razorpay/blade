import type { StoryFn, Meta } from '@storybook/react-vite';
import { Title } from '@storybook/addon-docs/blocks';
import type { RTBBadgeProps } from './types';
import { RTBBadge as RTBBadgeComponent } from './RTBBadge';
import BaseBox from '~components/Box/BaseBox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="RTBBadge"
      componentDescription="The Razorpay Trusted Business (RTB) badge — a brand shield paired with a faded pill that reassures users the business is verified by Razorpay."
      figmaURL="https://www.figma.com/design/fc7NbN38dG7olgm9mzpVx4/Checkout-DS?node-id=340-10923&m=dev"
    >
      <Title>Usage</Title>
      <BaseBox
        backgroundColor="surface.background.gray.intense"
        padding="spacing.5"
        borderRadius="medium"
      >
        <RTBBadgeComponent variant="neutral" />
      </BaseBox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/RTBBadge',
  component: RTBBadgeComponent,
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
    ...getStyledPropsArgTypes(),
  },
  args: {
    type: 'full',
    variant: 'neutral',
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<RTBBadgeProps>;

const RTBBadgeTemplate: StoryFn<typeof RTBBadgeComponent> = (args) => {
  // The neutral variant uses static-white text, so render it over a dark surface for contrast.
  return (
    <BaseBox
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      borderRadius="medium"
      display="inline-flex"
    >
      <RTBBadgeComponent {...args} />
    </BaseBox>
  );
};

export const Default = RTBBadgeTemplate.bind({});

export const Neutral = RTBBadgeTemplate.bind({});
Neutral.args = {
  variant: 'neutral',
};

export const Subtle: StoryFn<typeof RTBBadgeComponent> = (args) => {
  // The subtle variant uses static-black text, so render it over a light surface for contrast.
  return (
    <BaseBox
      backgroundColor="surface.background.gray.subtle"
      padding="spacing.5"
      borderRadius="medium"
      display="inline-flex"
    >
      <RTBBadgeComponent {...args} />
    </BaseBox>
  );
};
Subtle.args = {
  variant: 'subtle',
};

export const IconOnly = RTBBadgeTemplate.bind({});
IconOnly.args = {
  type: 'icon',
};
