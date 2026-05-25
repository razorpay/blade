import React from 'react';
import { Slider } from '..';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<Slider />', () => {
  it('should render Slider with default props', () => {
    const { container } = renderWithSSR(<Slider label="Volume" defaultValue={50} />);
    expect(container).toMatchSnapshot();
  });
});
