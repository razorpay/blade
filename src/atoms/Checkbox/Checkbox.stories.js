import React from 'react';
import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
import Checkbox from './Checkbox';

storiesOf('Checkbox', module)
  .addParameters({
    component: Checkbox,
  })
  .add('with text', () => <Checkbox checked={false} />);
