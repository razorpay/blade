import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, select, boolean } from '@storybook/addon-knobs';
import Link from './Link';

const sizeOptions = {
  xsmall: 'xsmall',
  small: 'small',
  medium: 'medium',
  large: 'large',
};

const targetOptions = {
  blank: '_blank',
  self: '_self',
  parent: '_parent',
  top: '_top',
};

storiesOf('Link', module)
  .addParameters({
    component: Link,
  })
  .add('default', () => (
    <Link
      size={select('Size', sizeOptions, 'large')}
      href={text('Href', 'https://razorpay.com', 'Web')}
      target={select('Target', targetOptions, 'link', 'Web')}
      rel={text('Rel', 'author', 'Web')}
      disabled={boolean('disabled', false)}
    >
      {text('Display Text', 'https://www.razorpay.com')}
    </Link>
  ));
