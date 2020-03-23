import React from 'react';
import { storiesOf } from '@storybook/react';
import { select, text } from '@storybook/addon-knobs';
import Text from './Text';

const sizeOptions = {
  xxsmall: 'xxsmall',
  xsmall: 'xsmall',
  small: 'small',
  medium: 'medium',
  large: 'large',
};

storiesOf('Text', module)
  .addParameters({
    component: Text,
  })
  .add('default', () => (
    <Text size={select('Size', sizeOptions, 'large')}>
      {text('Display Text', 'The quick brown fox jumps over the lazy dog')}
    </Text>
  ))
  .add('as span', () => (
    <Text size={select('Size', sizeOptions, 'large')} as="span">
      {text('Display Text', 'The quick brown fox jumps over the lazy dog')}
    </Text>
  ))
  .add('show content in only 3 line and hide the rest ', () => (
    <Text
      size={select('Size', sizeOptions, 'large')}
      maxLines={select('maxLines', 'number of lines', 3)}
    >
      {text(
        'Display Text',
        'The quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog The quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog The quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog ',
      )}
    </Text>
  ));
