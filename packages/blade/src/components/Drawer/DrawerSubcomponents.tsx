import React from 'react';
import { Badge, BadgeProps } from '~components/Badge';
import { BaseHeader } from '~components/BaseHeaderFooter/BaseHeader';
import { Box } from '~components/Box';
import { IconComponent } from '~components/Icons';
import { DrawerContext } from './DrawerContext';
import { DrawerHeaderProps } from './types';
import { DrawerHeaderAsset } from './DrawerHeaderAsset';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { drawerComponentIds } from './drawerComponentIds';
import { useVerifyAllowedChildren } from '~utils/useVerifyAllowedChildren';

const _DrawerHeader = ({ title, subtitle, leading, trailing, titleSuffix }: DrawerHeaderProps) => {
  const { close, defaultInitialFocusRef, stackingLevel } = React.useContext(DrawerContext);

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
      showCloseButton={stackingLevel < 2}
      showBackButton={stackingLevel >= 2}
      closeButtonRef={defaultInitialFocusRef}
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

const _DrawerBody = ({ children }: { children: React.ReactNode }) => {
  return <Box padding="spacing.6">{children}</Box>;
};
const DrawerBody = assignWithoutSideEffects(_DrawerBody, {
  componentId: drawerComponentIds.DrawerBody,
});

const _DrawerHeaderBadge = (props: BadgeProps) => {
  return <Badge size="small" {...props} />;
};
const DrawerHeaderBadge = assignWithoutSideEffects(_DrawerHeaderBadge, {
  componentId: drawerComponentIds.DrawerHeaderBadge,
});

const _DrawerHeaderIcon = ({ icon: Icon }: { icon: IconComponent }) => {
  return <Icon color="surface.icon.gray.normal" size="medium" />;
};
const DrawerHeaderIcon = assignWithoutSideEffects(_DrawerHeaderIcon, {
  componentId: drawerComponentIds.DrawerHeaderIcon,
});

export { DrawerHeader, DrawerBody, DrawerHeaderBadge, DrawerHeaderIcon, DrawerHeaderAsset };
