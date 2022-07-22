import React from 'react';
import { VisuallyHidden } from '..';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<VisuallyHidden />', () => {
  it('should render VisuallyHidden content', () => {
    const displayText = 'Text only visible to screen readers';
    const { container } = renderWithTheme(<VisuallyHidden>{displayText}</VisuallyHidden>);
    expect(container).toMatchSnapshot();
  });
});
