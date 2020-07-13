import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { storiesOf } from '@storybook/react';
import Modalize from '../BottomSheet';
import Text from '../../atoms/Text';
import View from '../../atoms/View';

const Item = styled(View)`
  height: 40px;
  padding: 8px;
`;

const LIST = [
  'Samsung',
  'Xiaomi',
  'OnePlus',
  'Apple',
  'Vivo',
  'Oppo',
  'Lenovo',
  'LG',
  'Nokia',
  'HTC',
];

const data = new Array(LIST.length).fill({}).map((item, index) => ({
  id: index,
  name: LIST[index],
}));

storiesOf('Modalize')
  .addParameters({ component: Modalize })
  .add('default', () => {
    const modalRef = React.createRef();
    return (
      <>
        <TouchableOpacity
          onPress={() => {
            modalRef?.current.open();
          }}
        >
          <Text>Open BottomSheet</Text>
        </TouchableOpacity>
        <Modalize ref={modalRef}>
          {data.map((item) => (
            <Item key={item.id}>
              <Text>{item.name}</Text>
            </Item>
          ))}
        </Modalize>
      </>
    );
  });
