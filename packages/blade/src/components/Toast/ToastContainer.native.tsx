import React from 'react';
import { View } from 'react-native';
import { Toast } from './Toast.native';
import { useToast } from './useToast.native';
import { useTheme } from '~components/BladeProvider';

/**
 * ToastContainer for React Native.
 *
 * Mount once at the app root (e.g. inside `<BladeProvider>`). Renders
 * all currently-active toasts stacked from the bottom of the screen.
 *
 * Web's ToastContainer uses `react-hot-toast`'s `<Toaster />`. RN can't
 * use that (web-only library) — this implementation subscribes to the
 * `useToast` external store via `useSyncExternalStore` and renders the
 * native `<Toast>` component for each visible toast.
 */
const ToastContainer = (): React.ReactElement | null => {
  const { theme } = useTheme();
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <View
      style={{
        position: 'absolute',
        left: theme.spacing[5],
        right: theme.spacing[5],
        bottom: theme.spacing[8],
      }}
      pointerEvents="box-none"
    >
      {toasts.map((entry) => (
        <Toast key={entry.id} {...entry} isVisible={entry.visible} />
      ))}
    </View>
  );
};

export { ToastContainer };
