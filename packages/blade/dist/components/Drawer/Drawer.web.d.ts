import { default as React } from 'react';
import { BladeElementRef } from '../../utils/types';
/**
 * ### Drawer Component
 *
 * A drawer is a panel that slides in mostly from right side of the screen over the existing content in the viewport.
 * It helps in providing additional details or context and can also be used to promote product features or new products.
 *
 * ---
 *
 * #### Usage
 *
 * ```jsx
  const MyDrawer = () => {
    const [showDrawer, setShowDrawer] = React.useState(false);
    return (
      <Box>
        <Button onClick={() => setShowDrawer(true)}>Open Drawer</Button>
        <Drawer
          isOpen={showDrawer}
          onDismiss={() => setShowDrawer(false)}
        >
          <DrawerHeader title="Announcements" />
          <DrawerBody>
            <FTXAnnouncement />
            <CatPictures />
          </DrawerBody>
        <Drawer>
      </Box>
    )
  }
 * ```
 *
 *  ---
 *
 * Checkout {@link https://blade.razorpay.com/?path=/docs/components-drawer Drawer Documentation}
 *
 *
 */
declare const Drawer: React.ForwardRefExoticComponent<{
    isOpen: boolean;
    onDismiss: () => void;
    onUnmount?: (() => void) | undefined;
    showOverlay?: boolean | undefined;
    children: React.ReactNode;
    zIndex?: number | undefined;
    accessibilityLabel?: string | undefined;
    initialFocusRef?: React.MutableRefObject<any> | undefined;
    isLazy?: boolean | undefined;
} & import('../../utils/types').DataAnalyticsAttribute & import('../../utils/types').TestID & React.RefAttributes<BladeElementRef>>;
export { Drawer };
