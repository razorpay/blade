import React, { useRef } from 'react';
import styled from 'styled-components/native';
import { storiesOf } from '@storybook/react';
import BottomSheet from '../BottomSheet';
import Text from '../../atoms/Text';
import View from '../../atoms/View';
import Space from '../../atoms/Space';
import Button from '../../atoms/Button';

const Item = styled(View)`
  height: 40px;
  padding: 8px;
`;

const list = [
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

const data = new Array(list.length).fill({}).map((item, index) => ({
  id: index,
  name: list[index],
}));

storiesOf('BottomSheet')
  .addParameters({ component: BottomSheet })
  .add('default', () => {
    const bottomSheetRef = useRef();
    return (
      <>
        <Button
          onClick={() => {
            bottomSheetRef?.current.open();
          }}
        >
          Open BottomSheet
        </Button>

        <BottomSheet ref={bottomSheetRef}>
          <BottomSheet.Header>
            <Space padding={[1]}>
              <View>
                <Text>Header</Text>
              </View>
            </Space>
          </BottomSheet.Header>

          <BottomSheet.Content>
            {data.map((item) => (
              <Item key={item.id}>
                <Text>{item.name}</Text>
              </Item>
            ))}
          </BottomSheet.Content>
          <BottomSheet.Footer>
            <View>
              <Text>Footer</Text>
            </View>
          </BottomSheet.Footer>
        </BottomSheet>
      </>
    );
  });
