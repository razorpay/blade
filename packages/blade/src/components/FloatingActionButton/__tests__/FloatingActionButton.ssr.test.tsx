import React from 'react';
import { FloatingActionButton } from '../FloatingActionButton';
import { PlusIcon } from '~components/Icons';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<FloatingActionButton />', () => {
  it('should render FloatingActionButton ssr', () => {
    const { container } = renderWithSSR(
      <FloatingActionButton icon={PlusIcon}>Create payment</FloatingActionButton>,
    );

    expect(container).toMatchSnapshot();
  });
});
