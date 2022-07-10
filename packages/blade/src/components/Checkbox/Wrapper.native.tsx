import React from 'react';
import { View } from 'react-native';

const Wrapper = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return <View>{children}</View>;
};

export { Wrapper };
