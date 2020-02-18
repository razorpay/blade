import React from 'react';
import { storiesOf } from '@storybook/react';
import Link from './Link';
import { text, select } from '@storybook/addon-knobs';
import { withKnobs } from '@storybook/addon-ondevice-knobs';

const sizeOptions = {
  small: 'small',
  medium: 'medium',
  large: 'large',
};

storiesOf('Link', module)
  .addDecorator(withKnobs)
  .addParameters({
    component: Link,
  })
  .add('default', () => (
    <Link size={select('Size', sizeOptions, 'large')}>
      {text('Display Text', 'https://www.razorpay.com')}
    </Link>
  ));
