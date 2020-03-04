import React from 'react';
import { renderWithTheme } from '../../../_helpers/testing';
import Text from '../../Text';
import Card from '../index';

describe('Renders <Card /> correctly', () => {
  it('should create an empty card with specified props', () => {
    const { container } = renderWithTheme(
      <Card
        height="50%"
        width="100px"
        maxHeight="200px"
        maxWidth="100px"
        minHeight="200px"
        minWidth="50px"
      />,
    );
    expect(container).toMatchSnapshot();
  });
  it('should create a card with text', () => {
    const displayText = 'Hello';
    const { container, getByText } = renderWithTheme(
      <Card
        height="50%"
        width="100px"
        maxHeight="200px"
        maxWidth="100px"
        minHeight="200px"
        minWidth="50px"
      >
        <Text>{displayText}</Text>
      </Card>,
    );
    const helpTextComponent = getByText(displayText);
    expect(helpTextComponent.props.children).toEqual(displayText);
    expect(container).toMatchSnapshot();
  });
});
