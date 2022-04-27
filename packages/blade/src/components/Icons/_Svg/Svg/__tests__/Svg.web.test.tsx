import React from 'react';
import Svg from '..';
import renderWithTheme from '../../../../../_helpers/testing/renderWithTheme.web';

describe('<Svg />', () => {
  it('should render html svg component', () => {
    const { container } = renderWithTheme(
      <Svg height="20px" width="20px" viewBox="0 0 24 24" fill="none" />,
    );
    expect(container).toMatchSnapshot();
  });
});
