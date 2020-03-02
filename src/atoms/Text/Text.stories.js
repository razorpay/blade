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
  ));
