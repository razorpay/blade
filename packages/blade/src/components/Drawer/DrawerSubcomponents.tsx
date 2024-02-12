import React from 'react';
import { drawerComponentIds } from './drawerComponentIds';
import { DrawerHeaderAsset } from './DrawerHeaderAsset';
import { DrawerContext } from './DrawerContext';
import type { DrawerHeaderProps } from './types';
import type { BadgeProps } from '~components/Badge';
import { Badge } from '~components/Badge';
import { BaseHeader } from '~components/BaseHeaderFooter/BaseHeader';
import { Box } from '~components/Box';
import type { IconComponent } from '~components/Icons';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { useVerifyAllowedChildren } from '~utils/useVerifyAllowedChildren';

const _DrawerHeader = ({
  title,
  subtitle,
  leading,
  trailing,
  titleSuffix,
}: DrawerHeaderProps): React.ReactElement => {
  const { close, closeButtonRef, backButtonRef, stackingLevel } = React.useContext(DrawerContext);

  const isLevelOneStacking = stackingLevel < 2;

  useVerifyAllowedChildren({
    children: titleSuffix,
    componentName: 'DrawerHeader titleSuffix',
    allowedComponents: [drawerComponentIds.DrawerHeaderBadge],
  });

  useVerifyAllowedChildren({
    children: leading,
    componentName: 'DrawerHeader leading',
    allowedComponents: [drawerComponentIds.DrawerHeaderIcon, drawerComponentIds.DrawerHeaderAsset],
  });

  return (
    <BaseHeader
      showCloseButton={isLevelOneStacking}
      showBackButton={!isLevelOneStacking}
      closeButtonRef={closeButtonRef}
      backButtonRef={backButtonRef}
      onCloseButtonClick={() => close()}
      onBackButtonClick={() => close()}
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
  return <Box padding="spacing.6">{children}</Box>;
};
const DrawerBody = assignWithoutSideEffects(_DrawerBody, {
  componentId: drawerComponentIds.DrawerBody,
});

const _DrawerHeaderBadge = (props: BadgeProps): React.ReactElement => {
  return <Badge size="small" {...props} />;
};
const DrawerHeaderBadge = assignWithoutSideEffects(_DrawerHeaderBadge, {
  componentId: drawerComponentIds.DrawerHeaderBadge,
});

const _DrawerHeaderIcon = ({ icon: Icon }: { icon: IconComponent }): React.ReactElement => {
  return <Icon color="surface.icon.gray.normal" size="medium" />;
};
const DrawerHeaderIcon = assignWithoutSideEffects(_DrawerHeaderIcon, {
  componentId: drawerComponentIds.DrawerHeaderIcon,
});

export { DrawerHeader, DrawerBody, DrawerHeaderBadge, DrawerHeaderIcon, DrawerHeaderAsset };
