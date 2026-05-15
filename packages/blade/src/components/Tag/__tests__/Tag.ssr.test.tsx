/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React from 'react';

import renderWithSSR from '~utils/testing/renderWithSSR.web';

import { Tag } from '../Tag';

describe('<Tag />', () => {
  it('should render tag', () => {
    const { container } = renderWithSSR(
      <Tag
        onDismiss={() => {
          console.log('tag dismissed');
        }}
      >
        in:User
      </Tag>,
    );
    expect(container).toMatchSnapshot();
  });
});
