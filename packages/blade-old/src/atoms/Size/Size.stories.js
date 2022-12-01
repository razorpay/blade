import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';

import View from '../View';
import Text from '../Text';
import Size from './Size';

const StyledView = styled(View)`
  background-color: ${(props) => props.theme.bladeOld.colors.shade[940]};
`;

storiesOf('Size', module)
  .addParameters({
    component: Size,
  })
  .add('default', () => (
    <Size
      height={text('height', '100%')}
      width={text('width', '10px')}
      maxHeight={text('maxHeight', '20px')}
      maxWidth={text('maxWidth', '20px')}
      minHeight={text('minHeight', '5px')}
      minWidth={text('minWidth', '5px')}
    >
      <StyledView>
        <Text>Content</Text>
      </StyledView>
    </Size>
  ));
