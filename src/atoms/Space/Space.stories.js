import React from 'react';
import { storiesOf } from '@storybook/react';
import { select, text } from '@storybook/addon-knobs';
import Text from '../Text';
import Space from './Space';

const sizeOptions = {
  xxsmall: 'xxsmall',
  xsmall: 'xsmall',
  small: 'small',
  medium: 'medium',
  large: 'large',
};

storiesOf('Space', module)
  .addParameters({
    component: Space,
  })
  .add('default', () => (
    <Space margin={[1, 1]} padding={[2, 2]}>
      <Text size={select('Size', sizeOptions, 'large')} as="span">
        {text('Display Text', 'The quick brown fox jumps over the lazy dog ')}
      </Text>
    </Space>
  ));
