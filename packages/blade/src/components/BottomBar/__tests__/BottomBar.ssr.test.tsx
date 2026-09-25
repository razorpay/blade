import React from 'react';
import { BottomBar } from '../BottomBar';
import { Button } from '~components/Button';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<BottomBar />', () => {
  it('should render BottomBar ssr', () => {
    const { container } = renderWithSSR(
      <BottomBar>
        <Button variant="secondary" isFullWidth>
          Cancel
        </Button>
        <Button isFullWidth>Continue</Button>
      </BottomBar>,
    );
    expect(container).toMatchSnapshot();
  });
});
