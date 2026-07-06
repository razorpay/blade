/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { Title } from '@storybook/addon-docs/blocks';
import { AppBar, AppBarActions, AppBarLeading } from '../AppBar';
import type { AppBarProps } from '../types';
import { Avatar } from '~components/Avatar';
import { Box } from '~components/Box';
import { IconButton } from '~components/Button/IconButton';
import { Text } from '~components/Typography';
import { BellIcon, CloseIcon, StorefrontIcon, UserIcon } from '~components/Icons';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

const OPTIMIZER_LOGO_URL = 'https://cdn.razorpay.com/static/assets/optimizer_logo.svg';

const MerchantLogo = (): React.ReactElement => (
  <Avatar name="Mavenshop" variant="square" size="large" />
);

const OptimizerLogo = (): React.ReactElement => (
  <img
    src={OPTIMIZER_LOGO_URL}
    alt="Razorpay Optimizer"
    style={{ width: 'auto', height: 'auto', display: 'block' }}
  />
);

const StoreLogo = (): React.ReactElement => (
  <Avatar icon={StorefrontIcon} variant="square" size="large" />
);

const TitleInitialsLogo = (): React.ReactElement => (
  <Avatar name="Maven Shop" variant="square" size="large" />
);

const DocsPage = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="AppBar"
      componentDescription="A top-of-screen application/page header that gives context (logo and/or title), an optional back affordance, and a trailing slot for page-level actions. Use it for mobile and compact desktop surfaces where a full TopNav is too heavy."
      figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=123476-15909&t=al61hwUh8Ms2HXUw-4"
    >
      <Title>Usage</Title>
      <Text>
        Compose `AppBar` with `AppBarLeading` for the brand/title cluster and `AppBarActions` for
        trailing actions. Pass `backButton` to render a back affordance at the left edge.
      </Text>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/AppBar',
  component: AppBar,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['neutral', 'subtle'],
    },
    isSticky: {
      control: { type: 'boolean' },
    },
  },
  args: {
    variant: 'neutral',
    isSticky: true,
  },
  parameters: {
    docs: {
      page: DocsPage,
    },
  },
} as Meta<typeof AppBar>;

const DefaultTemplate: StoryFn<typeof AppBar> = (args: AppBarProps) => {
  return (
    <AppBar {...args} backButton={{ onClick: noop, accessibilityLabel: 'Go back' }}>
      <AppBarLeading title="Order details" />
    </AppBar>
  );
};

export const Default = DefaultTemplate.bind({});
Default.storyName = 'Default';

const WithLogoTemplate: StoryFn<typeof AppBar> = (args: AppBarProps) => {
  return (
    <AppBar {...args} backButton={{ onClick: noop, accessibilityLabel: 'Go back' }}>
      <AppBarLeading logo={<OptimizerLogo />} trustBadge={{ variant: 'full' }} />
    </AppBar>
  );
};

export const WithLogo = WithLogoTemplate.bind({});
WithLogo.storyName = 'With Logo';

const WithActionsTemplate: StoryFn<typeof AppBar> = (args: AppBarProps) => {
  return (
    <AppBar {...args} backButton={{ onClick: noop, accessibilityLabel: 'Go back' }}>
      <AppBarLeading
        logo={<TitleInitialsLogo />}
        title="Maven Shop"
        trustBadge={{ variant: 'full' }}
      />
      <AppBarActions>
        <IconButton
          icon={UserIcon}
          emphasis="moderate"
          accessibilityLabel="Profile"
          onClick={noop}
        />
        <IconButton
          icon={CloseIcon}
          emphasis="moderate"
          accessibilityLabel="Close"
          onClick={noop}
        />
      </AppBarActions>
    </AppBar>
  );
};

export const WithActions = WithActionsTemplate.bind({});
WithActions.storyName = 'With Actions';

const LogoAndTitleTemplate: StoryFn<typeof AppBar> = (args: AppBarProps) => {
  return (
    <AppBar {...args} backButton={{ onClick: noop, accessibilityLabel: 'Go back' }}>
      <AppBarLeading logo={<StoreLogo />} title="Maven Shop" />
      <AppBarActions>
        <IconButton
          icon={CloseIcon}
          emphasis="moderate"
          accessibilityLabel="Close"
          onClick={noop}
        />
      </AppBarActions>
    </AppBar>
  );
};

export const LogoAndTitle = LogoAndTitleTemplate.bind({});
LogoAndTitle.storyName = 'Logo And Title';

const TitleWithIconBadgeTemplate: StoryFn<typeof AppBar> = (args: AppBarProps) => {
  return (
    <AppBar {...args} backButton={{ onClick: noop, accessibilityLabel: 'Go back' }}>
      <AppBarLeading title="Maven Shop" trustBadge={{ variant: 'icon-only' }} />
    </AppBar>
  );
};

export const TitleWithIconBadge = TitleWithIconBadgeTemplate.bind({});
TitleWithIconBadge.storyName = 'Title With Icon Badge';

const SubtleVariantTemplate: StoryFn<typeof AppBar> = (args: AppBarProps) => {
  return (
    <Box backgroundColor="surface.background.gray.subtle" minHeight="200px">
      <AppBar
        {...args}
        variant="subtle"
        backButton={{ onClick: noop, accessibilityLabel: 'Go back' }}
      >
        <AppBarLeading title="Settings" />
        <AppBarActions>
          <IconButton icon={UserIcon} accessibilityLabel="Profile" onClick={noop} />
        </AppBarActions>
      </AppBar>
      <Box padding="spacing.6">
        <Text>The `subtle` variant adapts to a light/embedded page background.</Text>
      </Box>
    </Box>
  );
};

export const SubtleVariant = SubtleVariantTemplate.bind({});
SubtleVariant.storyName = 'Subtle Variant';

const StickyTemplate: StoryFn<typeof AppBar> = (args: AppBarProps) => {
  return (
    <Box height="320px" overflowY="auto" backgroundColor="surface.background.gray.subtle">
      <AppBar {...args} isSticky backButton={{ onClick: noop, accessibilityLabel: 'Go back' }}>
        <AppBarLeading
          logo={<MerchantLogo />}
          title="Maven Shop"
          trustBadge={{ variant: 'full' }}
        />
        <AppBarActions>
          <IconButton icon={BellIcon} accessibilityLabel="Notifications" onClick={noop} />
        </AppBarActions>
      </AppBar>
      <Box padding="spacing.6" display="flex" flexDirection="column" gap="spacing.5">
        {Array.from({ length: 20 }).map((_, index) => (
          <Text key={index}>Scroll content row {index + 1}</Text>
        ))}
      </Box>
    </Box>
  );
};

export const Sticky = StickyTemplate.bind({});
Sticky.storyName = 'Sticky On Scroll';

const MerchantCheckoutTemplate: StoryFn<typeof AppBar> = (args: AppBarProps) => {
  return (
    <AppBar
      {...args}
      backButton={{ onClick: noop, accessibilityLabel: 'Go back' }}
      accessibilityLabel="Mavenshop checkout"
    >
      <AppBarLeading title="Mavenshop" trustBadge={{ variant: 'full' }} />
      <AppBarActions>
        <IconButton
          icon={UserIcon}
          emphasis="moderate"
          accessibilityLabel="Profile"
          onClick={noop}
        />
      </AppBarActions>
    </AppBar>
  );
};

export const MerchantCheckout = MerchantCheckoutTemplate.bind({});
MerchantCheckout.storyName = 'Merchant Checkout';
