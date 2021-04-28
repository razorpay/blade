import React from 'react';
import { storiesOf } from '@storybook/react';
import { select, text, number } from '@storybook/addon-knobs';
import Text from './Text';

const sizeOptions = {
  xxsmall: 'xxsmall',
  xsmall: 'xsmall',
  small: 'small',
  medium: 'medium',
  large: 'large',
};

const weightOptions = {
  light: 'light',
  bold: 'bold',
  regular: 'regular',
};

const htmlTagOptions = ['p', 'div', 'span'];

storiesOf('Text', module)
  .addParameters({
    component: Text,
  })
  .add('default', () => (
    <Text
      size={select('Size', sizeOptions, 'large')}
      weight={select('Weight', weightOptions, 'regular')}
      //@ts-expect-error
      as={select('as', htmlTagOptions, 'div')}
    >
      {text('Display Text', 'The quick brown fox jumps over the lazy dog ')}
    </Text>
  ))
  .add('maxLines', () => (
    <Text
      size={select('Size', sizeOptions, 'large')}
      weight={select('Weight', weightOptions, 'regular')}
      //@ts-expect-error
      as={select('as', htmlTagOptions, 'div')}
      maxLines={number('maxLines', 3)}
    >
      {text(
        'Display Text',
        'The quick brown fox jumps over the lazy dog brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog The quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog The quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog dog he quick brown fox jumps over the lazy dog he quick brown fox jumps over the lazy dog',
      )}
    </Text>
  ));
