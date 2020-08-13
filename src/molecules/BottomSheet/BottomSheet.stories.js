import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import View from '../../atoms/View';
import Space from '../../atoms/Space';
import Text from '../../atoms/Text';
import TextInput from '../../atoms/TextInput';
import BottomSheet from './BottomSheet';

const Item = styled(View)`
  height: 40px;
  padding: 8px;
`;

const list = [
  'Apple',
  'Asus',
  'Blackberry',
  'Honor',
  'HTC',
  'Huawei',
  'Lava',
  'Lenovo',
  'LG',
  'Motorola',
  'Nexus',
  'Nokia',
  'OnePlus',
  'Oppo',
  'Panasonic',
  'Pixel',
  'Realme',
  'Samsung',
  'Sony',
  'Toshiba',
  'Vivo',
  'Xiaomi',
];

const data = new Array(list.length).fill({}).map((item, index) => ({
  id: index,
  name: list[index],
}));

export const sections = [
  {
    title: 'Section1',
    data: list,
  },
  {
    title: 'Section2',
    data: list,
  },
];

storiesOf('BottomSheet', module)
  .addParameters({
    component: BottomSheet,
  })
  .add('default', () => {
    return (
      <>
        <Text>Default</Text>
        <BottomSheet visible={true} onClose={() => {}}>
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
    return (
      <>
        <Text>Non-Scrollable BottomSheet</Text>
        <BottomSheet visible={true} onClose={() => {}} adjustToContentHeight>
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
  .add('non-scrollable with footer', () => {
    return (
      <>
        <Text>Non-Scrollable BottomSheet with Footer</Text>
        <BottomSheet visible={true} onClose={() => {}} adjustToContentHeight>
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
          <BottomSheet.Footer>
            <View>
              <Text>Footer</Text>
            </View>
          </BottomSheet.Footer>
        </BottomSheet>
      </>
    );
  })
  .add('without Header', () => {
    return (
      <>
        <Text>Without Header</Text>
        <BottomSheet visible={true} onClose={() => {}}>
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
    return (
      <>
        <Text>Without Footer</Text>
        <BottomSheet visible={true} onClose={() => {}}>
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
    return (
      <>
        <Text>With Text-Input</Text>
        <BottomSheet visible={true} initialHeight={300} onClose={() => {}}>
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
  })
  .add('SectionList', () => {
    return (
      <BottomSheet visible={true} initialHeight={300} onClose={() => {}}>
        <BottomSheet.SectionList
          sections={sections}
          renderItem={({ item }) => (
            <Space padding={[1]}>
              <View>
                <Text>{item}</Text>
              </View>
            </Space>
          )}
          renderSectionHeader={({ section }) => (
            <View>
              <Text>{section.title}</Text>
            </View>
          )}
          keyExtractor={(item) => item}
        />
      </BottomSheet>
    );
  });
