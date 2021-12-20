import React, { ReactElement } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Button as ButtonProps } from './Button';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'violet',
  },
  text: { color: 'black' },
});

const Button = ({ onPress, text }: ButtonProps): ReactElement => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;
