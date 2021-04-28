import React from 'react';
import Text from '../index';
import { renderWithTheme } from '../../../_helpers/testing';

describe('<Text />', () => {
  it('should render regular text', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(<Text>{displayText}</Text>);
    expect(container).toMatchSnapshot();
  });

  it('should render bold text', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(<Text weight="bold">{displayText}</Text>);
    expect(container).toMatchSnapshot();
  });

  it('should render underlined text', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(<Text _isUnderlined>{displayText}</Text>);
    expect(container).toMatchSnapshot();
  });

  it('should render text with display content center aligned', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(<Text align="center">{displayText}</Text>);
    expect(container).toMatchSnapshot();
  });

  it('should render text with display content right aligned', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(<Text align="right">{displayText}</Text>);
    expect(container).toMatchSnapshot();
  });

  it('should render text with display content auto aligned when align prop is of value "initial"', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(<Text align="initial">{displayText}</Text>);
    expect(container).toMatchSnapshot();
  });

  it('should render text with display content auto aligned when align prop is of value "inherit"', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(<Text align="inherit">{displayText}</Text>);
    expect(container).toMatchSnapshot();
  });
});
