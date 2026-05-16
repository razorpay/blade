/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React from 'react';

import renderWithSSR from '~utils/testing/renderWithSSR.web';
import { Box } from '~components/Box';
import { Fade } from '~components/Fade';
import { Text } from '~components/Typography';
import { Button } from '~components/Button';

import { AnimateInteractions } from '../index';

describe('<AnimateInteractions />', () => {
  it('should render its children as expected', () => {
    const { container } = renderWithSSR(
      <AnimateInteractions>
        <Box>
          <Text>Test</Text>
          <Fade>
            <Button>Submit</Button>
          </Fade>
        </Box>
      </AnimateInteractions>,
    );
    expect(container).toMatchSnapshot();
  });
});
