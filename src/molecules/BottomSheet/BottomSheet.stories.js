import React, { useRef } from 'react';
import styled from 'styled-components/native';
import { storiesOf } from '@storybook/react';
import Text from '../../atoms/Text';
import View from '../../atoms/View';
import Space from '../../atoms/Space';
import Button from '../../atoms/Button';
import TextInput from '../../atoms/TextInput';
import BottomSheet from './BottomSheet';

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

storiesOf('BottomSheet', module)
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
  })
  .add('non-scrollable', () => {
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

        <BottomSheet ref={bottomSheetRef} adjustToContentHeight>
          <BottomSheet.Header>
            <Space padding={[1]}>
              <View>
                <Text>Header</Text>
              </View>
            </Space>
          </BottomSheet.Header>

          <BottomSheet.Content>
            <Space padding={[2]}>
              <View>
                <Text>Yamaha</Text>
              </View>
            </Space>

            <Space padding={[2]}>
              <View>
                <Text>Honda</Text>
              </View>
            </Space>

            <Space padding={[2]}>
              <View>
                <Text>Kawasaki</Text>
              </View>
            </Space>
          </BottomSheet.Content>
        </BottomSheet>
      </>
    );
  })
  .add('without Header', () => {
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
  })
  .add('without Footer', () => {
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
          <BottomSheet.Content>
            {data.map((item) => (
              <Item key={item.id}>
                <Text>{item.name}</Text>
              </Item>
            ))}
          </BottomSheet.Content>
        </BottomSheet>
      </>
    );
  })
  .add('with text-input', () => {
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

        <BottomSheet ref={bottomSheetRef} alwaysOpen={300}>
          <BottomSheet.Content>
            <Space padding={[2]}>
              <TextInput value="blade" />
            </Space>
            <Space padding={[2, 0, 2, 0]}>
              <View>
                <Text>Honda</Text>
              </View>
            </Space>
            <Space padding={[2, 0, 2, 0]}>
              <View>
                <Text>Kawasaki</Text>
              </View>
            </Space>
          </BottomSheet.Content>
        </BottomSheet>
      </>
    );
  });
