import React from 'react';
import Text from '../index';
import { renderWithTheme } from '../../../_helpers/testing';

describe('<Text />', () => {
  it('renders regular text', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(<Text>{displayText}</Text>);
    expect(container).toMatchSnapshot();
  });

  it('renders bold text', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(<Text weight="bold">{displayText}</Text>);
    expect(container).toMatchSnapshot();
  });

  it('renders underlined text', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(<Text _isUnderlined>{displayText}</Text>);
    expect(container).toMatchSnapshot();
  });

  it('renders text with display content center aligned', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(<Text align="center">{displayText}</Text>);
    expect(container).toMatchSnapshot();
  });

  it('renders text with display content right aligned', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(<Text align="right">{displayText}</Text>);
    expect(container).toMatchSnapshot();
  });

  it('renders text with display content auto aligned when align prop is of value "initial"', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(<Text align="initial">{displayText}</Text>);
    expect(container).toMatchSnapshot();
  });

  it('renders text with display content auto aligned when align prop is of value "inherit"', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(<Text align="inherit">{displayText}</Text>);
    expect(container).toMatchSnapshot();
  });

  it('renders default text', () => {
    const displayText = 'Displaying some text';
    const { getByTestId } = renderWithTheme(<Text>{displayText}</Text>);
    const textElement = getByTestId('ds-text');
    expect(textElement).toBeTruthy();
    expect(textElement.props.size).toBe('large');
    expect(textElement.props.color).toBe('shade.980');
    expect(textElement.props.align).toBe('left');
    expect(textElement.props.weight).toBe('regular');
    expect(textElement.props._isUnderlined).toBe(false);
    expect(textElement.props._letterSpacing).toBe('small');
    expect(textElement.props._lineHeight).toBe(undefined);
  });
});
