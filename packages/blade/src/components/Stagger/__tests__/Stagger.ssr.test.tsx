/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React from 'react';
import { Stagger } from '../index';
import renderWithSSR from '~utils/testing/renderWithSSR.web';
import { Fade } from '~components/Fade';
import { Text } from '~components/Typography';

describe('<Stagger />', () => {
  it('should render its children as expected', () => {
    const { container } = renderWithSSR(
      <Stagger>
        <Fade>
          <Text>Item 1</Text>
        </Fade>
        <Fade>
          <Text>Item 2</Text>
        </Fade>
        <Fade>
          <Text>Item 3</Text>
        </Fade>
      </Stagger>,
    );
    expect(container).toMatchSnapshot();
  });
});
