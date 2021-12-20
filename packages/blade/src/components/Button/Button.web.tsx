import React, { ReactElement } from 'react';
import { Button as ButtonProps } from './Button.d';

const Button = ({ onPress, text }: ButtonProps): ReactElement => {
  return <button onClick={onPress}>{text}</button>;
};

export default Button;
