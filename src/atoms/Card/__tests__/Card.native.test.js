import React from 'react';
import { renderWithTheme } from '../../../_helpers/testing';
import Text from '../../Text';
import Card from '../index';

describe('<Card />', () => {
  describe('shadow', () => {
    it('renders a Card with a shadow and specified props', () => {
      const { container } = renderWithTheme(
        <Card
          height="50%"
          width="100px"
          maxHeight="200px"
          maxWidth="100px"
          minHeight="200px"
          minWidth="50px"
          variant="shadow"
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('renders a Card with a shadow and text content', () => {
      const displayText = 'Hello';
      const { container, getByText } = renderWithTheme(
        <Card variant="shadow">
          <Text>{displayText}</Text>
        </Card>,
      );
      const helpTextComponent = getByText(displayText);
      expect(helpTextComponent.props.children).toEqual(displayText);
      expect(container).toMatchSnapshot();
    });
  });

  describe('outline', () => {
    it('renders a Card with an outline and specified props', () => {
      const { container } = renderWithTheme(
        <Card
          height="50%"
          width="100px"
          maxHeight="200px"
          maxWidth="100px"
          minHeight="200px"
          minWidth="50px"
          variant="outline"
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('renders a Card with an outline and text content', () => {
      const displayText = 'Hello';
      const { container, getByText } = renderWithTheme(
        <Card variant="shadow">
          <Text>{displayText}</Text>
        </Card>,
      );
      const helpTextComponent = getByText(displayText);
      expect(helpTextComponent.props.children).toEqual(displayText);
      expect(container).toMatchSnapshot();
    });
  });
});
