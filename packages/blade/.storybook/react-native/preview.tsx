import 'react-native-gesture-handler';
import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import { PortalHost, PortalProvider } from '@gorhom/portal';

export const decorators = [
  (StoryFn) => (
    // `flex: 1` (not just padding) is required so the BottomSheet portal host can
    // occupy the full screen — otherwise overlays (e.g. DatePicker's calendar sheet)
    // teleport to a zero-height host and render nothing on-device.
    <PortalProvider>
      <View style={styles.container}>
        <StoryFn />
      </View>
      <PortalHost name="BladeBottomSheetPortal" />
    </PortalProvider>
  ),
  withBackgrounds,
];

export const parameters = {
  backgrounds: [
    { name: 'plain', value: 'white', default: true },
    { name: 'warm', value: 'hotpink' },
    { name: 'cool', value: 'deepskyblue' },
  ],
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});
