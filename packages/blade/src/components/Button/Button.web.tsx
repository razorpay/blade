import type { ReactElement } from 'react';
import React from 'react';
import type { Button as ButtonProps } from './Button.d';

const Button = ({ onPress, text }: ButtonProps): ReactElement => {
  return <button onClick={onPress}>{text}</button>;
};

export default Button;
