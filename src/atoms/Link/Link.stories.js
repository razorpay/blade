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

const relOptions = {
  alternate: 'alternate',
  author: 'author',
  bookmark: 'bookmark',
  external: 'external',
  help: 'help',
  license: 'license',
  next: 'next',
  nofollow: 'nofollow',
  noreferrer: 'noreferrer',
  noopener: 'noopener',
  prev: 'prev',
  search: 'search',
  tag: 'tag',
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
      rel={select('Rel', relOptions, 'link', 'Web')}
    >
      {text('Display Text', 'https://www.razorpay.com')}
    </Link>
  ));
