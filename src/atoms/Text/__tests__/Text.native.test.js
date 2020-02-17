import React from 'react';
import Text from '../index';
import { renderWithTheme } from '../../../utils/testing';

describe('Renders <Text /> correctly', () => {
  it('snapshot testing with regular text', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(<Text>{displayText}</Text>);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with bold text', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(<Text weight="bold">{displayText}</Text>);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with underlined text', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(<Text underline>{displayText}</Text>);
    expect(container).toMatchSnapshot();
  });

  it('renders default text, defaultProps are assigned', () => {
    const displayText = 'Displaying some text';
    const { getByTestId } = renderWithTheme(<Text>{displayText}</Text>);
    const textElement = getByTestId('ds-text');
    expect(textElement).toBeTruthy();
    expect(textElement.props.weight).toBe('regular');
    expect(textElement.props.size).toBe('small');
    expect(textElement.props.underline).toBe(false);
  });
});
