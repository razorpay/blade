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
      rel={text('Rel', 'tag', 'Web')}
    >
      {text('Display Text', 'https://www.razorpay.com')}
    </Link>
  ))
  .add('default with rel', () => (
    <Link
      size={select('Size', sizeOptions, 'large')}
      href={text('Href', 'https://razorpay.com', 'Web')}
      rel={text('Rel', 'author', 'Web')}
    >
      {text('Display Text', 'https://www.razorpay.com')}
    </Link>
  ));
