import React from 'react';
import { LightBox, LightBoxBody, LightBoxItem } from '../index';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<LightBox />', () => {
  it('should render LightBox in SSR', () => {
    const { container } = renderWithSSR(
      <LightBox isOpen={false} onDismiss={jest.fn()}>
        <LightBoxBody>
          <LightBoxItem src="https://picsum.photos/seed/lightbox-1/1200/800" alt="Document 1" />
          <LightBoxItem src="https://picsum.photos/seed/lightbox-2/1200/800" alt="Document 2" />
        </LightBoxBody>
      </LightBox>,
    );

    expect(container).toMatchSnapshot();
  });
});
