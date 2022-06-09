import React from 'react';
import renderWithTheme from '../../../_helpers/testing/renderWithTheme.web';
import VisuallyHidden from '../VisuallyHidden.web';

describe('<VisuallyHidden />', () => {
  // TODO: Enable css testing
  it('should render VisuallyHidden content', () => {
    const displayText = 'Text only visible to screen readers';
    const { container } = renderWithTheme(<VisuallyHidden>{displayText}</VisuallyHidden>);
    expect(container).toMatchSnapshot();
  });
});
