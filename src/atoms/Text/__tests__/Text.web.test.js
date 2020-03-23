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
    const displayText =
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum";
    const { container } = renderWithTheme(<Text maxLines={2}>{displayText}</Text>);
    expect(container).toMatchSnapshot();
  });
  it('snapshot testing with as in text', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(<Text as="span">{displayText}</Text>);
    expect(container).toMatchSnapshot();
  });
});
