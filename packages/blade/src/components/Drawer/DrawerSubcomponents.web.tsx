import React from 'react';
import { drawerComponentIds } from './drawerComponentIds';
import { DrawerContext } from './DrawerContext';
import type { DrawerHeaderProps } from './types';
import { useDrawerStack } from './StackProvider';
import { BaseHeader } from '~components/BaseHeaderFooter/BaseHeader';
import { Box } from '~components/Box';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const _DrawerHeader = ({
  title,
  subtitle,
  leading,
  trailing,
  titleSuffix,
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
      titleSuffix={titleSuffix}
      subtitle={subtitle}
      leading={leading}
      trailing={trailing}
      {...makeAnalyticsAttribute(rest)}
    />
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
    <Box padding={drawerPadding} overflow="auto" flex="1">
      {children}
    </Box>
  );
};
const DrawerBody = assignWithoutSideEffects(_DrawerBody, {
  componentId: drawerComponentIds.DrawerBody,
});

export { DrawerHeader, DrawerBody, drawerPadding };
