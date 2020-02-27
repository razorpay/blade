import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-ondevice-knobs';
import { select } from '@storybook/addon-knobs';
import styled from 'styled-components';

import Button from './Button';

const StyledContainer = styled.View`
  flex: 1;
  justify-content: space-around;
`;

const variants = {
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
};

const sizes = {
  xsmall: 'xsmall',
  small: 'small',
  medium: 'medium',
  large: 'large',
};

const iconPosition = {
  left: 'left',
  right: 'right',
};

storiesOf('Button', module)
  .addParameters({
    component: Button,
  })
  .addDecorator(withKnobs)
  .add('Button', () => (
    <StyledContainer>
      <Button
        size={select('Sizes', sizes, 'medium')}
        variant={select('Variants', variants, 'primary')}
        icon="info"
        align="center"
      />
      <Button
        size={select('Sizes', sizes, 'medium')}
        variant={select('Variants', variants, 'primary')}
      >
        Button
      </Button>
      <Button
        size={select('Sizes', sizes, 'medium')}
        variant={select('Variants', variants, 'primary')}
        icon="info"
        iconPosition={select('IconPosition', iconPosition, 'left')}
      >
        Button with Icon
      </Button>
      <Button
        size={select('Sizes', sizes, 'medium')}
        variant={select('Variants', variants, 'primary')}
        icon="info"
        disabled
        iconPosition={select('IconPosition', iconPosition, 'left')}
      >
        Button with Icon
      </Button>
    </StyledContainer>
  ));
