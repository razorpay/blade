import React from 'react';
import { storiesOf } from '@storybook/react';
import { select } from '@storybook/addon-knobs';
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

storiesOf('Icon', module)
  .addParameters({
    component: Icon,
  })
  .add('default', () => {
    return (
      <>
        {Object.values(icons).map((Ico, index) => {
          return (
            <Ico
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
