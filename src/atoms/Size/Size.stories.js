import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';

import Text from '../Text';
import Size from './Size';

storiesOf('Size', module)
  .addParameters({
    component: Size,
  })
  .add('default', () => (
    <Size
      height={text('height', '100%')}
      width={text('width', '10px')}
      maxHeight={text('maxHeight', '20px')}
      maxWidth={text('maxWidth', '20px')}
      minHeight={text('minHeight', '5px')}
      minWidth={text('minWidth', '5px')}
    >
      <Text>simple div</Text>
    </Size>
  ));
