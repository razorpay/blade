import 'react-native-gesture-handler';
import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';
import { StyleSheet, ScrollView, View } from 'react-native';

export const decorators = [
  (StoryFn) => (
    <View style={styles.root}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <StoryFn />
      </ScrollView>
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
  root: { flex: 1, width: '100%' },
  scroll: { flex: 1, width: '100%' },
  content: { flexGrow: 1, width: '100%', padding: 16, paddingBottom: 80 },
});
