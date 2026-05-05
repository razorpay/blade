import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Toast } from './Toast.native';
import { useToast } from './useToast.native';

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
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((entry) => (
        <Toast key={entry.id} {...entry} isVisible={entry.visible} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 32,
  },
});

export { ToastContainer };
