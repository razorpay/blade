import React from 'react';
import { drawerComponentIds } from './drawerComponentIds';
import { DrawerContext } from './DrawerContext';
import type { DrawerHeaderProps } from './types';
import { BaseHeader } from '~components/BaseHeaderFooter/BaseHeader';
import { Box } from '~components/Box';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _DrawerHeader = ({
  title,
  subtitle,
  leading,
  trailing,
  titleSuffix,
}: DrawerHeaderProps): React.ReactElement => {
  const { close, closeButtonRef } = React.useContext(DrawerContext);

  return (
    <BaseHeader
      showCloseButton={true}
      closeButtonRef={closeButtonRef}
      onCloseButtonClick={() => close()}
      title={title}
      titleSuffix={titleSuffix}
      subtitle={subtitle}
      leading={leading}
      trailing={trailing}
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

const _DrawerBody = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <Box padding="spacing.6" overflowY="auto">
      {children}
    </Box>
  );
};
const DrawerBody = assignWithoutSideEffects(_DrawerBody, {
  componentId: drawerComponentIds.DrawerBody,
});

export { DrawerHeader, DrawerBody };
