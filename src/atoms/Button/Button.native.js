import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#202c41',
    paddingVertical: 14,
    borderRadius: 6,
    borderWidth: 1,
    marginVertical: 7,
  },
  text: {
    color: '#fff',
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
});

const Button = ({ onClick, children, ...rest }) => (
  <TouchableOpacity onPress={onClick} style={styles.button} {...rest}>
    <Text style={styles.text}>{children}</Text>
  </TouchableOpacity>
);

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Button;
