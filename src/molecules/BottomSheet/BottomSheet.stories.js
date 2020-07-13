import React, { useRef } from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { storiesOf } from '@storybook/react';
import BottomSheet from '../BottomSheet';
import Text from '../../atoms/Text';
import View from '../../atoms/View';
import Space from '../../atoms/Space';

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

storiesOf('BottomSheet')
  .addParameters({ component: BottomSheet })
  .add('default', () => {
    const bottomSheetRef = useRef();
    return (
      <>
        <TouchableOpacity
          onPress={() => {
            bottomSheetRef?.current.open();
          }}
        >
          <Text>Open BottomSheet</Text>
        </TouchableOpacity>
        <BottomSheet
          ref={bottomSheetRef}
          HeaderComponent={
            <Space padding={[1]}>
              <View>
                <Text>Header</Text>
              </View>
            </Space>
          }
          FooterComponent={
            <Space padding={[1]}>
              <View>
                <Text>Footer</Text>
              </View>
            </Space>
          }
        >
          {data.map((item) => (
            <Item key={item.id}>
              <Text>{item.name}</Text>
            </Item>
          ))}
        </BottomSheet>
      </>
    );
  });
