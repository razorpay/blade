/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React from 'react';
import { Slide } from '../index';
import renderWithSSR from '~utils/testing/renderWithSSR.web';
import { Tag } from '~components/Tag';

describe('<Slide />', () => {
  it('should enhance and render child to add slide', () => {
    const { container } = renderWithSSR(
      <Slide>
        <Tag
          onDismiss={() => {
            console.log('tag dismissed');
          }}
        >
          in:User
        </Tag>
      </Slide>,
    );
    expect(container).toMatchSnapshot();
  });
});
