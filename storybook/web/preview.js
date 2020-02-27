import React from 'react';
import { ThemeProvider } from 'styled-components';
import { addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs/react';

const theme = {};

addDecorator(withKnobs);

addDecorator((Story) => (
  <ThemeProvider theme={theme}>
    <Story />
  </ThemeProvider>
));
