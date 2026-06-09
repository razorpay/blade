import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
});

const StoryScrollView = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {children}
    </ScrollView>
  );
};

export { StoryScrollView };
