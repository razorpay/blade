import React from 'react';
import { storiesOf } from '@storybook/react';
import { select } from '@storybook/addon-knobs';
import { getIconNames } from '../../_helpers/icon';
import { getColorKeys } from '../../_helpers/theme';
import * as icons from '../../icons';
import Icon from './Icon';

const sizes = {
  xsmall: 'xsmall',
  small: 'small',
  medium: 'medium',
  large: 'large',
  xlarge: 'xlarge',
};

const iconOptions = getIconNames().reduce(
  (options, option) => ({
    ...options,
    [option]: option,
  }),
  {},
);

console.log(icons);
storiesOf('Icon', module)
  .addParameters({
    component: Icon,
  })
  .add('default', () => {
    return (
      <Icon
        name={select('Name', iconOptions, 'info')}
        fill={select('fill', getColorKeys(), 'shade.950')}
        size={select('sizes', sizes, 'medium')}
        testID="icon"
      />
    );
  })
  .add('test', () => {
    return (
      <>
        {Object.values(icons).map((Comp, index) => {
          return (
            <Comp
              key={index}
              fill={select('fill', getColorKeys(), 'purple.900')}
              size={select('sizes', sizes, 'medium')}
              data-testid="icon"
            />
          );
        })}
      </>
    );
  });
