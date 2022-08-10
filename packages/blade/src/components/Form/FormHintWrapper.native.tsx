import React from 'react';
import { View } from 'react-native';

const FormHintWrapper = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {children}
    </View>
  );
};

export { FormHintWrapper };
