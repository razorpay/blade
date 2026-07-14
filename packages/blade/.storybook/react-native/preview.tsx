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
  backgrounds: [
    { name: 'plain', value: 'white', default: true },
    { name: 'warm', value: 'hotpink' },
    { name: 'cool', value: 'deepskyblue' },
  ],
};

const styles = StyleSheet.create({
  // flex:1 so scrollable story frames can fill StoryView height
  container: { flex: 1, padding: 16 },
});
