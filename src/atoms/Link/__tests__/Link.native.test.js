import React from 'react';
import Link from '../index';
import { renderWithTheme } from '../../../utils/testing';
import { fireEvent } from '@testing-library/react-native';

describe('Renders <Link /> correctly', () => {
  it('snapshot testing', () => {
    const displayText = 'Displaying some link';
    const { container } = renderWithTheme(<Link>{displayText}</Link>);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing, renders visited link', () => {
    const displayText = 'Displaying some link';
    const { container } = renderWithTheme(<Link visited>{displayText}</Link>);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing, renders small link', () => {
    const displayText = 'Displaying some link';
    const { container } = renderWithTheme(<Link size="small">{displayText}</Link>);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing, renders medium link', () => {
    const displayText = 'Displaying some link';
    const { container } = renderWithTheme(<Link size="medium">{displayText}</Link>);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing, renders large link', () => {
    const displayText = 'Displaying some link';
    const { container } = renderWithTheme(<Link size="large">{displayText}</Link>);
    expect(container).toMatchSnapshot();
  });

  it('onPressIn/onPressOut link styles look as expected', () => {
    const displayText = 'Displaying some link';
    const { getByText, container } = renderWithTheme(<Link>{displayText}</Link>);
    const button = getByText(displayText).parentNode;
    fireEvent.pressIn(button);
    expect(container).toMatchSnapshot();
    fireEvent.pressOut(button);
    expect(container).toMatchSnapshot();
  });

  it('onClick works as expected', () => {
    const displayText = 'Displaying some link';
    const mockOnPress = jest.fn();
    const { getByText } = renderWithTheme(<Link onClick={mockOnPress}>{displayText}</Link>);
    const button = getByText(displayText).parentNode;
    fireEvent.press(button);
    expect(mockOnPress).toBeCalled();
  });
});
