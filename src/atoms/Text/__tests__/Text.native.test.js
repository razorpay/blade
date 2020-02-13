import React from 'react';
import { StyleSheet } from 'react-native';
import Text from '../index';
import { renderWithTheme } from '../../../utils/testing';

describe('Renders <Text /> correctly', () => {
  it('snapshot testing', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(<Text>{displayText}</Text>);
    expect(container).toMatchSnapshot();
  });

  it('renders default text, defaultProps are assigned', () => {
    const displayText = 'Displaying some text';
    const { getByTestId } = renderWithTheme(<Text>{displayText}</Text>);
    const textElement = getByTestId('ds-text');
    expect(textElement).toBeTruthy();
    expect(textElement.props.weight).toBe('regular');
    expect(textElement.props.size).toBe('m');
    expect(StyleSheet.flatten(textElement.props.style).fontFamily).toBe('Lato-Regular');
    expect(textElement.props.underline).toBe(false);
  });

  it('renders normal text', () => {
    const displayText = 'Displaying some text';
    const { getByTestId } = renderWithTheme(<Text weight="regular">{displayText}</Text>);
    const textElement = getByTestId('ds-text');
    expect(textElement).toBeTruthy();
    expect(textElement.props.weight).toBe('regular');
    expect(StyleSheet.flatten(textElement.props.style).fontFamily).toBe('Lato-Regular');
  });

  it('renders bold text', () => {
    const displayText = 'Displaying some text';
    const { getByTestId } = renderWithTheme(<Text weight="bold">{displayText}</Text>);
    const textElement = getByTestId('ds-text');
    expect(textElement).toBeTruthy();
    expect(textElement.props.weight).toBe('bold');
    expect(StyleSheet.flatten(textElement.props.style).fontFamily).toBe('Lato-Bold');
  });

  it('renders underlined text', () => {
    const displayText = 'Displaying some text';
    const { getByTestId } = renderWithTheme(<Text underline>{displayText}</Text>);
    const textElement = getByTestId('ds-text');
    expect(textElement).toBeTruthy();
    expect(textElement.props.underline).toBe(true);
    expect(StyleSheet.flatten(textElement.props.style).textDecorationLine).toBe('underline');
  });
});
