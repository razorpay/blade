import React from 'react';
import { storiesOf } from '@storybook/react';
import Icon from './Icon';

storiesOf('Icon', module)
  .addParameters({
    component: Icon,
  })
  .add('default', () => {
    return <Icon name="info" fill="shade.800" size="medium" />;
  });
