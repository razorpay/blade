import React from 'react';
import { View } from 'react-native';

const Rotate = ({ children }: { children: React.ReactNode }): React.ReactElement => (
  <View>{children}</View>
);

export default Rotate;
