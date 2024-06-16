import React from 'react';
import { VisuallyHidden } from '..';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<VisuallyHidden />', () => {
  it('should render VisuallyHidden content', () => {
    const displayText = 'Text only visible to screen readers';
    const { container } = renderWithTheme(<VisuallyHidden>{displayText}</VisuallyHidden>);
    expect(container).toMatchSnapshot();
  });

  it('should accept testID', () => {
    const displayText = 'Text only visible to screen readers';
    const { getByTestId } = renderWithTheme(
      <VisuallyHidden testID="visually-hidden-test">{displayText}</VisuallyHidden>,
    );
    expect(getByTestId('visually-hidden-test')).toBeTruthy();
  });
});
