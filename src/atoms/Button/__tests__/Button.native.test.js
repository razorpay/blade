import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import Button from '../index';

describe('Renders <Button /> correctly', () => {
  it('snapshot testing', () => {
    const { container } = render(<Button onClick={() => {}}>{'Click Me'}</Button>);
    expect(container).toMatchSnapshot();
  });

  it('renders button title correctly, defaultProps are assigned', () => {
    const { getByText, baseElement } = render(<Button onClick={() => {}}>{'Click Me'}</Button>);
    const button = getByText('Click Me');
    expect(button).toBeTruthy();
    expect(baseElement.props.children[0].props.children.props.onClick()).toBeUndefined();
  });

  it('onPress works as expected', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(<Button onClick={mockOnPress}>{'Click Me'}</Button>);
    const button = getByText('Click Me');
    fireEvent.press(button);
    expect(mockOnPress.mock.calls.length).toBe(1);
  });
});
