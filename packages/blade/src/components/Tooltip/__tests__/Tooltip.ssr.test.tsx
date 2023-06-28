import React from 'react';
import { Tooltip } from '../Tooltip';
import { Button } from '~components/Button';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<Tooltip />', () => {
  it('should render Tooltip ssr', () => {
    const name = 'Toggle Darkmode';
    const { container, queryByRole } = renderWithSSR(
      <Tooltip content="Hello world">
        <Button>Hello world</Button>
      </Tooltip>,
    );
    expect(queryByRole('tooltip', { name })).not.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
