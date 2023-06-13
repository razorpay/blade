import React from 'react';
import { Tooltip } from '../Tooltip';
import renderWithSSR from '~src/_helpers/testing/renderWithSSR.web';
import { Button } from '~components/Button';

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
