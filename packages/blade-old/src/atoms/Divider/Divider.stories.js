import React from 'react';
import { storiesOf } from '@storybook/react';
import { select } from '@storybook/addon-knobs';
import Divider from './Divider';

const directionOptions = {
  horizontal: 'horizontal',
  vertical: 'vertical',
};

storiesOf('Divider', module)
  .addParameters({
    component: Divider,
  })
  .add('default', () => (
    <Divider direction={select('Direction', directionOptions, 'horizontal')} color="primary.900" />
  ));
