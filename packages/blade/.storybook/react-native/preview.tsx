import 'react-native-gesture-handler';
import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';
import { StyleSheet, ScrollView } from 'react-native';

export const decorators = [
  (StoryFn) => (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <StoryFn />
    </ScrollView>
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
  contentContainer: { padding: 16 },
});
