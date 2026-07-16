import 'react-native-gesture-handler';
import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import { PortalHost } from '@gorhom/portal';

// `@storybook/react-native-ui` wraps every story in `@gorhom/bottom-sheet`'s
// `BottomSheetModalProvider`, which nests its OWN `PortalProvider` between the story
// and the app-level `BladeBottomSheetPortal` host declared in `BladeProvider.native`.
// `usePortal()` resolves to that nearest (Storybook) provider, so portal components
// (Drawer, BottomSheet, Popover, Tooltip, Modal, …) target a provider that has no
// `BladeBottomSheetPortal` host and their teleported content is silently dropped —
// making them impossible to verify on-device. Registering the same-named host inside
// the story decorator makes it resolvable on the nearest provider so portal content
// renders within the story canvas. Production is unaffected (a real app has only the
// single BladeProvider host).
export const decorators = [
  (StoryFn) => (
    <View style={styles.container}>
      <StoryFn />
      <PortalHost name="BladeBottomSheetPortal" />
    </View>
  ),
  withBackgrounds,
];

export const parameters = {
  layout: 'fullscreen',
  backgrounds: [
    { name: 'plain', value: 'white', default: true },
    { name: 'warm', value: 'hotpink' },
    { name: 'cool', value: 'deepskyblue' },
  ],
};

const styles = StyleSheet.create({
  // `flex: 1` lets the container fill the story canvas so absolutely-positioned
  // portal content (e.g. the full-height Drawer, BottomSheet, or DatePicker calendar sheet)
  // can size against a real viewport instead of collapsing to the intrinsic height
  // of the story's inline content.
  // Charts need full width with minimal horizontal padding.
  container: { flex: 1, width: '100%', paddingVertical: 8, paddingHorizontal: 0 },
});
