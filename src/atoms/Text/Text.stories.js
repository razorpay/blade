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

const htmlTagOptions = ['p', 'div', 'span'];

const maxLinesOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

storiesOf('Text', module)
  .addParameters({
    component: Text,
  })
  .add('default', () => (
    <Text size={select('Size', sizeOptions, 'large')} as="span">
      {text('Display Text', 'The quick brown fox jumps over the lazy dog ')}
    </Text>
  ))
  .add('text with as, maxLines', () => (
    <Text
      size={select('Size', sizeOptions, 'large')}
      maxLines={select('maxLines', maxLinesOptions, 3)}
      as={select('as', htmlTagOptions, 'div')}
    >
      {text(
        'Display Text',
        'The quick brown fox jumps over the lazy dog brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog The quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog The quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog',
      )}
    </Text>
  ));
