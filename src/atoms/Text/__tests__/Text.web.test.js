import React from 'react';
import { renderWithTheme } from '../../../_helpers/testing';

import Text from '../index';

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

  it('snapshot testing with maxLines in text', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(
      <Text truncate maxLines={2}>
        {displayText}
      </Text>,
    );
    expect(container).toMatchSnapshot();
  });
});
