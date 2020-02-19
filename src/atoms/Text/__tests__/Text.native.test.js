import React from 'react';
import Text from '../index';
import { renderWithTheme } from '../../../_helpers/testing';

describe('Renders <Text /> correctly', () => {
  it('snapshot testing with regular text', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(<Text>{displayText}</Text>);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with bold text', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(<Text _weight="bold">{displayText}</Text>);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with underlined text', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(<Text _isUnderlined>{displayText}</Text>);
    expect(container).toMatchSnapshot();
  });

  it('renders default text, defaultProps are assigned', () => {
    const displayText = 'Displaying some text';
    const { getByTestId } = renderWithTheme(<Text>{displayText}</Text>);
    const textElement = getByTestId('ds-text');
    expect(textElement).toBeTruthy();
    expect(textElement.props._weight).toBe('regular');
    expect(textElement.props.size).toBe('large');
    expect(textElement.props._isUnderlined).toBe(false);
    expect(textElement.props._letterSpacing).toBe('small');
    expect(textElement.props._lineHeight).toBe('large');
  });
});
