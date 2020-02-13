import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import Button from '../index';
import { renderWithTheme } from '../../../utils/testing';

describe('Renders <Button /> correctly', () => {
  it('snapshot testing', () => {
    const { container } = renderWithTheme(<Button onClick={() => {}}>{'Click Me'}</Button>);
    expect(container).toMatchSnapshot();
  });

  it('renders button title correctly, defaultProps are assigned', () => {
    const { getByTestId } = renderWithTheme(<Button onClick={() => {}}>{'Click Me'}</Button>);
    const button = getByTestId('ds-button');
    expect(button).toBeTruthy();
    expect(button.props.onClick).toBeUndefined();
  });

  it('onPress works as expected', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = renderWithTheme(<Button onClick={mockOnPress}>{'Click Me'}</Button>);
    const button = getByTestId('ds-button');
    fireEvent.press(button);
    expect(mockOnPress.mock.calls.length).toBe(1);
  });
});
