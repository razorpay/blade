import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, select } from '@storybook/addon-knobs';
import Link from './Link';

const sizeOptions = {
  xsmall: 'xsmall',
  small: 'small',
  medium: 'medium',
  large: 'large',
};

storiesOf('Link', module)
  .addParameters({
    component: Link,
  })
  .add('default', () => (
    <Link size={select('Size', sizeOptions, 'large')}>
      {text('Display Text', 'https://www.razorpay.com')}
    </Link>
  ))
  .add('default with href', () => (
    <Link size={select('Size', sizeOptions, 'large')} href="https://razorpay.com">
      {text('Display Text', 'https://www.razorpay.com')}
    </Link>
  ))
  .add('default with href and target', () => (
    <Link size={select('Size', sizeOptions, 'large')} hreg="https://razorpay.com" target="_blank">
      {text('Display Text', 'https://www.razorpay.com')}
    </Link>
  ));
