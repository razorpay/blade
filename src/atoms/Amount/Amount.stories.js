import React from 'react';
import { storiesOf } from '@storybook/react';
import { select, text } from '@storybook/addon-knobs';
import Amount from './Amount';

const sizeOptions = {
  medium: 'medium',
  large: 'large',
  xlarge: 'xlarge',
  xxlarge: 'xxlarge',
  xxxlarge: 'xxxlarge',
};

storiesOf('Amount', module)
  .addParameters({
    component: Amount,
  })
  .add('default', () => (
    <Amount size={select('Size', sizeOptions, 'large')}>{text('Amount', '1234')}</Amount>
  ));
