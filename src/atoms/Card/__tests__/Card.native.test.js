import React from 'react';
import { renderWithTheme } from '../../../_helpers/testing';
import Text from '../../Text';
import Card from '../index';

describe('<Card />', () => {
  describe('shadow', () => {
    it('renders a Card with a shadow', () => {
      const { container } = renderWithTheme(<Card variant="shadow" />);
      expect(container).toMatchSnapshot();
    });

    it('renders a Card with shadow and custom background color', () => {
      const { container } = renderWithTheme(
        <Card variant="shadow" backgroundColor="primary.920" />,
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
      const textComponent = getByText(displayText);
      expect(textComponent.props.children).toEqual(displayText);
      expect(container).toMatchSnapshot();
    });
  });

  describe('outline', () => {
    it('renders a Card with an outline', () => {
      const { container } = renderWithTheme(<Card variant="outline" />);
      expect(container).toMatchSnapshot();
    });

    it('renders a Card with an outline and custom background color', () => {
      const { container } = renderWithTheme(
        <Card variant="shadow" backgroundColor="primary.920" />,
      );
      expect(container).toMatchSnapshot();
    });

    it('renders a Card with an outline and custom border color', () => {
      const { container } = renderWithTheme(<Card variant="shadow" borderColor="primary.920" />);
      expect(container).toMatchSnapshot();
    });

    it('renders a Card with an outline and text content', () => {
      const displayText = 'Hello';
      const { container, getByText } = renderWithTheme(
        <Card variant="outline">
          <Text>{displayText}</Text>
        </Card>,
      );
      const textComponent = getByText(displayText);
      expect(textComponent.props.children).toEqual(displayText);
      expect(container).toMatchSnapshot();
    });
  });
});
