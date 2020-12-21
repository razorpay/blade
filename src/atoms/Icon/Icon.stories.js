import React from 'react';
import { storiesOf } from '@storybook/react';
import { select } from '@storybook/addon-knobs';
import { getIconNames } from '../../_helpers/icon';
import { getColorKeys } from '../../_helpers/theme';
import Icon from './Icon';

const sizes = {
  xsmall: 'xsmall',
  small: 'small',
  medium: 'medium',
  large: 'large',
  xlarge: 'xlarge',
};

const iconOptions = getIconNames().reduce(
  (options, option) => ({ ...options, [option]: option }),
  {},
);

storiesOf('Icon', module)
  .addParameters({
    component: Icon,
  })
  .add('default', () => {
    return (
      <Icon
        name={select('Name', iconOptions, 'info')}
        fill={select('fill', getColorKeys(), 'shade.980')}
        size={select('sizes', sizes, 'medium')}
        testID="icon"
      />
    );
  });
