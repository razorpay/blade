import React from 'react';
import { storiesOf } from '@storybook/react';
import Text from './Text';
import { withKnobs } from '@storybook/addon-ondevice-knobs';
import { select, text, color } from '@storybook/addon-knobs';
import fonts from '../../tokens/fonts';
const theme = {
  fonts,
};

const weightOptions = {
  regular: 'regular',
  bold: 'bold',
};

const letterSpacingOptions = {
  s: 's',
  m: 'm',
  l: 'l',
};

storiesOf('Text', module)
  .addParameters({
    component: Text,
  })
  .addDecorator(withKnobs)
  .add('default', () => (
    <Text
      size={select('Size', Object.keys(theme.fonts.size), 'm')}
      weight={select('Weight', weightOptions, 'regular')}
      letterSpacing={select('Letter Spacing', letterSpacingOptions, 's')}
      color={color('Text Color', undefined)}
    >
      {text('Display Text', 'The quick brown fox jumps over the lazy dog')}
    </Text>
  ));
