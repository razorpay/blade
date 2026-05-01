import 'react-native-gesture-handler';
import React from 'react';
import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';
import { StyleSheet, View } from 'react-native';
import type { Preview } from '@storybook/react-native';

const preview: Preview = {
  decorators: [
    (StoryFn) => (
      <View style={styles.container}>
        <StoryFn />
      </View>
    ),
    withBackgrounds,
  ],
  parameters: {
    backgrounds: [
      { name: 'plain', value: 'white', default: true },
      { name: 'warm', value: 'hotpink' },
      { name: 'cool', value: 'deepskyblue' },
    ],
  },
};

const styles = StyleSheet.create({
  container: { padding: 16 },
});

export default preview;
