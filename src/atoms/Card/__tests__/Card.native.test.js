import React from 'react';
import { renderWithTheme } from '../../../_helpers/testing';
import Text from '../../Text';
import Card from '../index';

describe('<Card />', () => {
  describe('shadowed', () => {
    it('renders a shadowed Card', () => {
      const { container } = renderWithTheme(<Card variant="shadowed" />);
      expect(container).toMatchSnapshot();
    });

    it('renders a shadowed Card with custom background color', () => {
      const { container } = renderWithTheme(
        <Card variant="shadowed" backgroundColor="primary.920" />,
      );
      expect(container).toMatchSnapshot();
    });

    it('renders a shadowed Card with text content', () => {
      const displayText = 'Hello';
      const { container, getByText } = renderWithTheme(
        <Card variant="shadowed">
          <Text>{displayText}</Text>
        </Card>,
      );
      const textComponent = getByText(displayText);
      expect(textComponent.props.children).toEqual(displayText);
      expect(container).toMatchSnapshot();
    });
  });

  describe('outlined', () => {
    it('renders an outlined Card', () => {
      const { container } = renderWithTheme(<Card variant="outlined" />);
      expect(container).toMatchSnapshot();
    });

    it('renders an outlined Card with custom background color', () => {
      const { container } = renderWithTheme(
        <Card variant="outlined" backgroundColor="primary.920" />,
      );
      expect(container).toMatchSnapshot();
    });

    it('renders an outlined Card with custom border color', () => {
      const { container } = renderWithTheme(<Card variant="outlined" borderColor="primary.920" />);
      expect(container).toMatchSnapshot();
    });

    it('renders an outlined Card with text content', () => {
      const displayText = 'Hello';
      const { container, getByText } = renderWithTheme(
        <Card variant="outlined">
          <Text>{displayText}</Text>
        </Card>,
      );
      const textComponent = getByText(displayText);
      expect(textComponent.props.children).toEqual(displayText);
      expect(container).toMatchSnapshot();
    });
  });
});
