import React from 'react';
import styled from 'styled-components';
import { drawerComponentIds } from './drawerComponentIds';
import { DrawerContext } from './DrawerContext';
import type { DrawerHeaderProps, DrawerFooterProps } from './types';
import { useDrawerStack } from './StackProvider';
import { BaseHeader } from '~components/BaseHeaderFooter/BaseHeader';
import { BaseFooter } from '~components/BaseHeaderFooter/BaseFooter';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { useTheme } from '~utils';

const _DrawerHeader = ({
  title,
  subtitle,
  leading,
  trailing,
  titleSuffix,
  children,
  color = 'information',
  showDivider = true,
  ...rest
}: DrawerHeaderProps): React.ReactElement => {
  const { close, closeButtonRef, stackingLevel, isExiting } = React.useContext(DrawerContext);
  const { drawerStack } = useDrawerStack();
  const { theme } = useTheme();

  const closeAllDrawers = (): void => {
    for (const onDismiss of Object.values(drawerStack)) {
      onDismiss();
    }
  };

  const isStackedDrawer = stackingLevel && stackingLevel > 1;

  const isAtleastOneDrawerOpen = Object.keys(drawerStack).length > 0;

  const backgroundGradient = `radial-gradient(150% 100% at 50% 100%, ${theme.colors.transparent} 0%, ${theme.colors.feedback.background[color].subtle} 100%)` as const;
  // This condition is to avoid back button disappear while stacked drawer is in the exiting transition
  const isDrawerExiting = isAtleastOneDrawerOpen && isExiting && stackingLevel !== 1;

  return (
    <BaseHeader
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      showBackButton={isStackedDrawer || isDrawerExiting}
      showCloseButton={true}
      closeButtonRef={closeButtonRef}
      onCloseButtonClick={() => closeAllDrawers()}
      onBackButtonClick={() => close()}
      title={title}
      size="xlarge"
      titleSuffix={titleSuffix}
      subtitle={subtitle}
      leading={leading}
      trailing={trailing}
      backgroundImage={backgroundGradient}
      showDivider={showDivider}
      {...makeAnalyticsAttribute(rest)}
    >
      {children}
    </BaseHeader>
  );
};

/**
 * #### Usage
 *
 * ```jsx
 * <DrawerHeader
 *  title="Announcements"
 *  subtitle="Checkout what's new in Razorpay"
 *  titleSuffix={<DrawerHeaderBadge>New</DrawerHeaderBadge>}
 *  leading={<DrawerHeaderIcon icon={AnnouncementIcon} />}
 *  trailing={<Button icon={DownloadIcon} />}
 * />
 * ```
 *
 */
const DrawerHeader = assignWithoutSideEffects(_DrawerHeader, {
  componentId: drawerComponentIds.DrawerHeader,
});

const drawerPadding = 'spacing.6';

const StyledDrawerBody = styled(BaseBox)(({ theme }) => {
  return {
    overflowY: 'auto',
    overflowX: 'hidden',
    // Reserve space for scrollbar gutter — prevents content from shifting when scrollbar appears
    scrollbarGutter: 'stable',
    // Firefox
    scrollbarWidth: 'thin',
    scrollbarColor: `${theme.colors.surface.border.gray.muted} transparent`,
    // WebKit (Chrome, Safari, Edge)
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.colors.surface.border.gray.muted,
      borderRadius: '10px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: theme.colors.surface.border.gray.subtle,
    },
  };
});

const _DrawerBody = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <StyledDrawerBody padding={drawerPadding} flex="1">
      {children}
    </StyledDrawerBody>
  );
};
const DrawerBody = assignWithoutSideEffects(_DrawerBody, {
  componentId: drawerComponentIds.DrawerBody,
});

const _DrawerFooter = ({
  children,
  showDivider = true,
  ...rest
}: DrawerFooterProps): React.ReactElement => {
  return (
    <Box position="sticky" {...makeAnalyticsAttribute(rest)}>
      <BaseFooter showDivider={showDivider}>{children}</BaseFooter>
    </Box>
  );
};

/**
 * #### Usage
 *
 * ```jsx
 * <DrawerFooter>
 *   <Button variant="primary" isFullWidth>
 *     Continue
 *   </Button>
 * </DrawerFooter>
 * ```
 *
 */
const DrawerFooter = assignWithoutSideEffects(_DrawerFooter, {
  componentId: drawerComponentIds.DrawerFooter,
});

export { DrawerHeader, DrawerBody, DrawerFooter, drawerPadding };
