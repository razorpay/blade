import React from 'react';
import Checkbox from './../Checkbox';
import { renderWithTheme } from '../../../_helpers/testing';

describe('Native <Checkbox />', () => {
  describe('Unchecked checkxox', () => {
    test('should render component when not checked with default props', () => {
      const { container } = renderWithTheme(<Checkbox title="Some Title" />);
      expect(container).toMatchSnapshot();
    });

    test('should render component when not checked with help text props', () => {
      const helpText = 'some Help text';
      const { getByText } = renderWithTheme(<Checkbox title="Some Title" helpText={helpText} />);
      const helpTextComponent = getByText(helpText);
      expect(helpTextComponent.props.size).toEqual('xsmall');
      expect(helpTextComponent.props.children).toEqual(helpText);
    });

    test('should render medium sized Checkbox', () => {
      const { container, getByText } = renderWithTheme(
        <Checkbox title="Some Title" helpText="some Help text" size="medium" />,
      );
      const component = getByText('Some Title');
      expect(container).toMatchSnapshot();
      expect(component.props.size).toEqual('medium');
    });

    test('should render component in disabled state', () => {
      const { getByTestId } = renderWithTheme(
        <Checkbox
          title="Some Title"
          helpText="some Help text"
          size="large"
          disabled={true}
          testID="disabledCheckBox"
        />,
      );
      const renderedComponent = getByTestId('disabledCheckBox');
      expect(renderedComponent.props.disabled).toEqual(true);
    });
  });

  describe('Checked', () => {
    test('should render component when checked with default props', () => {
      const { container } = renderWithTheme(<Checkbox title="Some Title" checked={true} />);
      expect(container).toMatchSnapshot();
    });
  });
});
