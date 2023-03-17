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

  it('should accept testID', () => {
    const displayText = 'Text only visible to screen readers';
    const { getByTestId } = renderWithTheme(
      <VisuallyHidden testID="visually-hidden-test">
        <Text>{displayText}</Text>
      </VisuallyHidden>,
    );
    expect(getByTestId('visually-hidden-test')).toBeTruthy();
  });
});
