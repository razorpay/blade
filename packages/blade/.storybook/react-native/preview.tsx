import 'react-native-gesture-handler';
import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';

export const decorators = [
  (StoryFn) => (
    <View style={styles.container}>
      <StoryFn />
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
  container: { flex: 1, width: '100%', paddingVertical: 8, paddingHorizontal: 0 },
});
