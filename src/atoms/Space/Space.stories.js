import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';
import Text from '../Text';
import Space from './Space';

storiesOf('Space', module)
  .addParameters({
    component: Space,
  })
  .add('default', () => (
    <Space margin={[1, 1]} padding={[2, 2]}>
      <Text as="span">{text('Display Text', 'The quick brown fox jumps over the lazy dog ')}</Text>
    </Space>
  ));
