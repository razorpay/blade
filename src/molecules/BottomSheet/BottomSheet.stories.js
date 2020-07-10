import React from 'react';
import { storiesOf } from '@storybook/react';
import BottomSheet from '../BottomSheet';
import Flex from '../../atoms/Flex';

storiesOf('BottomSheet')
  .addParameters({ component: BottomSheet })
  .add('default', () => {
    return (
      <Flex flex={1}>
        <BottomSheet />
      </Flex>
    );
  });
