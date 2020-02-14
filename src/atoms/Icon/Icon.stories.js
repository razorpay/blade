import React, { useContext } from 'react';
import { storiesOf } from '@storybook/react';
import Icon from './Icon';
import { ThemeContext } from 'styled-components';

storiesOf('Icon', module)
  .addParameters({
    component: Icon,
  })
  .add('with text', () => {
    const theme = useContext(ThemeContext);
    return <Icon name="info" fill={theme.colors.shade[800]} size="l" />;
  });
