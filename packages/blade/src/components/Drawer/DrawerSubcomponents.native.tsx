import React from 'react';
import { ScrollView } from 'react-native';
import { drawerComponentIds } from './drawerComponentIds';
import { DrawerContext } from './DrawerContext';
import type { DrawerHeaderProps, DrawerFooterProps } from './types';
import { useDrawerStack } from './StackProvider';
import { BaseHeader } from '~components/BaseHeaderFooter/BaseHeader';
import { BaseFooter } from '~components/BaseHeaderFooter/BaseFooter';
import { Box } from '~components/Box';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const _DrawerHeader = ({
  title,
  subtitle,
  leading,
  trailing,
  titleSuffix,
  children,
  // `color` drives the radial-gradient backgroundImage on web. Native has no CSS
  // radial-gradient, so we intentionally omit the gradient and keep the surface solid.
  color: _color = 'information',
  showDivider = true,
  ...rest
}: DrawerHeaderProps): React.ReactElement => {
  const { close, closeButtonRef, stackingLevel, isExiting } = React.useContext(DrawerContext);
  const { drawerStack } = useDrawerStack();

  const closeAllDrawers = (): void => {
    for (const onDismiss of Object.values(drawerStack)) {
      onDismiss();
    }
  };

  const isStackedDrawer = stackingLevel && stackingLevel > 1;

  const isAtleastOneDrawerOpen = Object.keys(drawerStack).length > 0;

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

const _DrawerBody = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <Box flex="1">
      <ScrollView>
        <Box padding={drawerPadding}>{children}</Box>
      </ScrollView>
    </Box>
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
  // Web uses position:'sticky'; native has no sticky positioning, so the footer
  // renders at the end of the column flex container instead.
  return (
    <Box {...makeAnalyticsAttribute(rest)}>
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
