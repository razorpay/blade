import React from 'react';
import { Text } from 'react-native';
import renderWithTheme from '../../../_helpers/testing/renderWithTheme.native';
import { VisuallyHidden } from '../';

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
