/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { Title } from '@storybook/addon-docs/blocks';
import { AppBar, AppBarActions, AppBarLeading } from '../AppBar';
import type { AppBarProps } from '../types';
import { Box } from '~components/Box';
import { IconButton } from '~components/Button/IconButton';
import { Text } from '~components/Typography';
import {
  BellIcon,
  CloseIcon,
  RazorpayIcon,
  SearchIcon,
  StorefrontIcon,
  UserIcon,
} from '~components/Icons';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

const MerchantLogo = (): React.ReactElement => (
  <RazorpayIcon size="large" color="surface.icon.staticWhite.normal" />
);

const StoreThumbnail = (): React.ReactElement => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    width="32px"
    height="32px"
    borderRadius="medium"
    backgroundColor="surface.background.gray.intense"
  >
    <StorefrontIcon size="medium" color="surface.icon.staticWhite.normal" />
  </Box>
);

const PromoIllustration = (): React.ReactElement => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    paddingX="spacing.4"
    paddingY="spacing.2"
    borderRadius="medium"
    backgroundColor="surface.background.gray.intense"
  >
    <Text size="xsmall" weight="semibold" color="surface.text.staticWhite.normal">
      ✨ 20% OFF
    </Text>
  </Box>
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
      <AppBarLeading logo={<MerchantLogo />} isTrustedBusiness />
    </AppBar>
  );
};

export const WithLogo = WithLogoTemplate.bind({});
WithLogo.storyName = 'With Logo';

const WithActionsTemplate: StoryFn<typeof AppBar> = (args: AppBarProps) => {
  return (
    <AppBar {...args} backButton={{ onClick: noop, accessibilityLabel: 'Go back' }}>
      <AppBarLeading logo={<MerchantLogo />} isTrustedBusiness />
      <AppBarActions>
        <IconButton icon={SearchIcon} accessibilityLabel="Search" onClick={noop} />
        <IconButton icon={UserIcon} accessibilityLabel="Profile" onClick={noop} />
        <IconButton icon={BellIcon} accessibilityLabel="Notifications" onClick={noop} />
      </AppBarActions>
    </AppBar>
  );
};

export const WithActions = WithActionsTemplate.bind({});
WithActions.storyName = 'With Actions';

const TextWithThumbnailTemplate: StoryFn<typeof AppBar> = (args: AppBarProps) => {
  return (
    <AppBar {...args} backButton={{ onClick: noop, accessibilityLabel: 'Go back' }}>
      <AppBarLeading prefix={<StoreThumbnail />} title="Body Text" subtitle="Online store" />
      <AppBarActions>
        <IconButton icon={CloseIcon} accessibilityLabel="Close" onClick={noop} />
      </AppBarActions>
    </AppBar>
  );
};

export const TextWithThumbnail = TextWithThumbnailTemplate.bind({});
TextWithThumbnail.storyName = 'Text With Thumbnail';

const TrailingIllustrationTemplate: StoryFn<typeof AppBar> = (args: AppBarProps) => {
  return (
    <AppBar {...args} backButton={{ onClick: noop, accessibilityLabel: 'Go back' }}>
      <AppBarLeading logo={<MerchantLogo />} isTrustedBusiness />
      <AppBarActions>
        <PromoIllustration />
      </AppBarActions>
    </AppBar>
  );
};

export const TrailingIllustration = TrailingIllustrationTemplate.bind({});
TrailingIllustration.storyName = 'Trailing Illustration';

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
        <AppBarLeading logo={<MerchantLogo />} isTrustedBusiness />
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
