import 'react-native-gesture-handler';
import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';
import { StyleSheet } from 'react-native';
import { View, ScrollView } from 'react-native';
import { PortalHost } from '@gorhom/portal';

export const decorators = [
  (StoryFn) => (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <StoryFn />
      </ScrollView>
      {/* Overlays (Tooltip, Popover, BottomSheet) portal to "BladeBottomSheetPortal".
          In the on-device Storybook the host mounted by BladeProvider isn't reachable
          from the story canvas, so we mount the host here, co-located with the story. */}
      <PortalHost name="BladeBottomSheetPortal" />
    </View>
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
  container: { flex: 1 },
  contentContainer: { padding: 16, flexGrow: 1 },
});
