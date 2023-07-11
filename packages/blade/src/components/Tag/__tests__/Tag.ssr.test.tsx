/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React from 'react';
import { Tag } from '../Tag';
import renderWithSSR from '~src/_helpers/testing/renderWithSSR.web';

describe('<Tag />', () => {
  it('should render tag', () => {
    const { container } = renderWithSSR(<Tag>in:User</Tag>);
    expect(container).toMatchSnapshot();
  });
});
