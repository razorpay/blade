import React from 'react';
//import { TouchableOpacity } from 'react-native';
import { storiesOf } from '@storybook/react';
import Modalize from '../Modalize';
//import Flex from '../../atoms/Flex';
//import Text from '../../atoms/Text';
//import View from '../../atoms/View';

storiesOf('Modalize')
  .addParameters({ component: Modalize })
  .add('default', () => {
    //const modalRef = useRef(null);
    return <Modalize />;
  });
