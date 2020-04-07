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
  .add('disabled', () => (
    <Link size={select('Size', sizeOptions, 'large')} disabled>
      {text('Display Text', 'https://www.razorpay.com')}
    </Link>
  ))
  .add('visited', () => (
    <Link size={select('Size', sizeOptions, 'large')} visited>
      {text('Display Text', 'https://www.razorpay.com')}
    </Link>
  ));
