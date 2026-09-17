import React from 'react';
import { ScrollView } from 'react-native';

const StoryScrollView = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
      {children}
    </ScrollView>
  );
};

export { StoryScrollView };
