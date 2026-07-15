import React from 'react';
import { Slider } from '..';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<Slider />', () => {
  it('renders single and range sliders on the server', () => {
    const { container } = renderWithSSR(
      <>
        <Slider label="Transaction limit" defaultValue={50} showMinMax />
        <Slider label="Amount" selectionType="range" defaultValue={[20, 80]} showThumbValue />
      </>,
    );
    expect(container).toMatchSnapshot();
  });
});
