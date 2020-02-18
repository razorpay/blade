import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import theme from '../../../tokens/theme';
import Checkbox from './../Checkbox';

describe('Native <Checkbox />', () => {
  describe('Unchecked checkxox', () => {
    test('should render component when not checked with default props', () => {
      const { container } = render(
        <ThemeProvider theme={theme}>
          <Checkbox title="Some Title" />
        </ThemeProvider>,
      );
      expect(container).toMatchSnapshot();
    });

    test('should render component when not checked with help text props', () => {
      const helpTextContent = 'some Help text';
      const { getByText } = render(
        <ThemeProvider theme={theme}>
          <Checkbox title="Some Title" helpText={helpTextContent} />
        </ThemeProvider>,
      );
      const helpTextComponent = getByText(helpTextContent);
      expect(helpTextComponent.props.size).toEqual('m');
      expect(helpTextComponent.props.disabled).toEqual(false);
      expect(helpTextComponent.props.children).toEqual(helpTextContent);
    });

    fit('should render medium sized Checkbox', () => {
      const { container, getByText } = render(
        <ThemeProvider theme={theme}>
          <Checkbox title="Some Title" helpText="some Help text" size="medium" />
        </ThemeProvider>,
      );
      const titleComponent = getByText('Some Title');
      expect(container).toMatchSnapshot();
      expect(titleComponent.props.size).toEqual('m');
    });
  });
});
