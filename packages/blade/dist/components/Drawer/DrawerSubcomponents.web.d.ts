import { default as React } from 'react';
import { DrawerHeaderProps } from './types';
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
declare const DrawerHeader: ({ title, subtitle, leading, trailing, titleSuffix, children, color, ...rest }: DrawerHeaderProps) => React.ReactElement;
declare const drawerPadding = "spacing.6";
declare const DrawerBody: ({ children }: {
    children: React.ReactNode;
}) => React.ReactElement;
export { DrawerHeader, DrawerBody, drawerPadding };
