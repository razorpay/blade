import React from 'react';
import { storiesOf } from '@storybook/react';
import { select } from '@storybook/addon-knobs';

import Flex from '../Flex';
import View from '../View';
import Indicator from './Indicator';

const fillOptions = {
  solid: 'solid',
  empty: 'empty',
};

storiesOf('Indicator', module)
  .addParameters({
    component: Indicator,
  })
  .add('default', () => (
    <Flex flex={1} justifyContent="space-evenly" alignItems="center" flexDirection="column">
      <View>
        <Indicator variant="positive" fill={select('fill', fillOptions, 'solid')} />
        <Indicator variant="negative" fill={select('fill', fillOptions, 'solid')} />
        <Indicator variant="information" fill={select('fill', fillOptions, 'solid')} />
        <Indicator variant="warning" fill={select('fill', fillOptions, 'solid')} />
        <Indicator variant="neutral" fill={select('fill', fillOptions, 'solid')} />
      </View>
    </Flex>
  ));
