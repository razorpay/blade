import React from 'react';
import { View } from 'react-native';

const FormHintTextWrapper = ({ children }: { children: React.ReactNode }): React.ReactElement => {
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

export { FormHintTextWrapper };
