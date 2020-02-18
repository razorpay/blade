import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import theme from '../../../tokens/theme';
import Checkbox from './../Checkbox';

describe('Native <Checkbox />', () => {
  describe('Unchecked checkxox', () => {
    test('should render checkbox when not checked with default props', () => {
      const { container } = render(
        <ThemeProvider theme={theme}>
          <Checkbox title="Some Title" />
        </ThemeProvider>,
      );
      expect(container).toMatchSnapshot();
    });

    test('should render checkbox when not checked with help text props', () => {
      const { container } = render(
        <ThemeProvider theme={theme}>
          <Checkbox title="Some Title" helpText="some Help text" />
        </ThemeProvider>,
      );
      expect(container).toMatchSnapshot();
    });

    test('should render medium sized Checkbox', () => {
      const { container } = render(
        <ThemeProvider theme={theme}>
          <Checkbox title="Some Title" helpText="some Help text" size="medium" />
        </ThemeProvider>,
      );
      expect(container).toMatchSnapshot();
    });
  });
});
