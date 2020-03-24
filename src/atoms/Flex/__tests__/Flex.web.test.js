import React from 'react';
import { render } from '@testing-library/react';

import View from '../../View';
import Flex from '../index';

describe('Renders <Flex /> correctly', () => {
  it('renders child of <Flex />(no styles) correctly', () => {
    const { container } = render(
      <Flex>
        <View />
      </Flex>,
    );
    expect(container).toMatchSnapshot();
  });
});
