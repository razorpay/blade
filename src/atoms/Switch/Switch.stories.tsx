import React from 'react';
import { storiesOf } from '@storybook/react';
import { select } from '@storybook/addon-knobs';

import Flex from '../Flex';
import View from '../View';
import Switch from './Switch';

const alignOptions = {
  left: 'left',
  center: 'center',
  right: 'right',
};

const sizeOptions = {
  medium: 'medium',
  large: 'large',
};

storiesOf('Switch', module)
  .addParameters({
    component: Switch,
  })
  .add('default', () => (
    <Flex flex={1} justifyContent="space-around" flexDirection="column">
      <View>
        <Switch size={select('size', sizeOptions, 'large')} />
        <Switch size={select('size', sizeOptions, 'large')} defaultOn={true} />
        <Switch size={select('size', sizeOptions, 'large')} on={true} />
        <Switch size={select('size', sizeOptions, 'large')} on={false} />
        <Switch size={select('size', sizeOptions, 'large')} disabled />
        <Switch size={select('size', sizeOptions, 'large')} disabled defaultOn={true} />
      </View>
    </Flex>
  ));
