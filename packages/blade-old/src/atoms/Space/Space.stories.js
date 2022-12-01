import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';
import Text from '../Text';
import View from '../View';
import Space from './Space';

const StyledView = styled(View)`
  background-color: ${(props) => props.theme.bladeOld.colors.shade[940]};
`;

storiesOf('Space', module)
  .addParameters({
    component: Space,
  })
  .add('with margin and padding', () => (
    <Space margin={[1, 1]} padding={[2, 2]}>
      <StyledView>
        <Text
          //@ts-expect-error
          as="span"
        >
          {text('Display Text', 'The quick brown fox jumps over the lazy dog ')}
        </Text>
      </StyledView>
    </Space>
  ));
