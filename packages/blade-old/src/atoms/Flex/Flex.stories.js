import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { select } from '@storybook/addon-knobs';
import Text from '../Text';
import View from '../View';
import Space from '../Space';
import Flex from './Flex';

const flexDirectionOptions = {
  column: 'column',
  row: 'row',
  'column-reverse': 'column-reverse',
  'row-reverse': 'row-reverse',
};

const justifyContentOptions = {
  center: 'center',
  'flex-end': 'flex-end',
  'flex-start': 'flex-start',
  'space-around': 'space-around',
  'space-between': 'space-between',
  'space-evenly': 'space-evenly',
};

const alignContentOptions = {
  center: 'center',
  stretch: 'stretch',
  'flex-end': 'flex-end',
  'flex-start': 'flex-start',
  'space-around': 'space-around',
  'space-between': 'space-between',
};

const alignItemsOptions = {
  baseline: 'baseline',
  center: 'center',
  'flex-end': 'flex-end',
  'flex-start': 'flex-start',
  stretch: 'stretch',
};

const StyledView = styled(View)`
  background-color: ${(props) => props.theme.bladeOld.colors.shade[940]};
`;

storiesOf('Flex', module)
  .addParameters({
    component: Flex,
  })
  .add('default', () => (
    <Flex>
      <View>
        <Space margin={[1, 2]} padding={2}>
          <StyledView>
            <Text>Content</Text>
          </StyledView>
        </Space>
        <Space margin={[1, 2]} padding={2}>
          <StyledView>
            <Text>Content</Text>
          </StyledView>
        </Space>
      </View>
    </Flex>
  ))
  .add('with alignments', () => (
    <Flex
      alignContent={select('align-content', alignContentOptions, 'center')}
      alignItems={select('align-items', alignItemsOptions, 'center')}
      justifyContent={select('justify-content', justifyContentOptions, 'center')}
      flexDirection="row"
    >
      <View>
        <Space margin={[1, 2]} padding={2}>
          <StyledView>
            <Text>Content</Text>
          </StyledView>
        </Space>
        <Space margin={[1, 2]} padding={2}>
          <StyledView>
            <Text>Content</Text>
          </StyledView>
        </Space>
      </View>
    </Flex>
  ))
  .add('with directions', () => (
    <Flex flexDirection={select('Direction', flexDirectionOptions, 'row')}>
      <View>
        <Space margin={[1, 2]} padding={2}>
          <StyledView>
            <Text>Content 1</Text>
          </StyledView>
        </Space>
        <Space margin={[1, 2]} padding={2}>
          <StyledView>
            <Text>Content 2</Text>
          </StyledView>
        </Space>
        <Space margin={[1, 2]} padding={2}>
          <StyledView>
            <Text>Content 3</Text>
          </StyledView>
        </Space>
        <Space margin={[1, 2]} padding={2}>
          <StyledView>
            <Text>Content 4</Text>
          </StyledView>
        </Space>
      </View>
    </Flex>
  ));
