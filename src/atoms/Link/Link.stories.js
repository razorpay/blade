import React from 'react';
import { storiesOf } from '@storybook/react';
import Link from './Link';
import { text, select } from '@storybook/addon-knobs';

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
  ));
