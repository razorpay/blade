import React from 'react';
import { Text } from 'react-native';
import { VisuallyHidden } from '../';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<VisuallyHidden />', () => {
  it('should render VisuallyHidden content', () => {
    const displayText = 'Text only visible to screen readers';
    const { toJSON, getByText } = renderWithTheme(
      <VisuallyHidden>
        <Text>{displayText}</Text>
      </VisuallyHidden>,
    );
    expect(getByText(displayText)).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });
});
