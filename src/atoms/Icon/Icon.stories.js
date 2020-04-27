import React from 'react';
import { storiesOf } from '@storybook/react';
import { select } from '@storybook/addon-knobs';
import { getIconNames } from '../../_helpers/icon';
import Icon from './Icon';

const iconOptions = getIconNames().reduce(
  (options, option) => ({ ...options, [option]: option }),
  {},
);
storiesOf('Icon', module)
  .addParameters({
    component: Icon,
  })
  .add('default', () => {
    return <Icon name={select('Name', iconOptions, 'info')} fill="shade.980" size="medium" />;
  });
