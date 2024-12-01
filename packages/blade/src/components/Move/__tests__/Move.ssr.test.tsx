/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React from 'react';
import { Move } from '../index';
import renderWithSSR from '~utils/testing/renderWithSSR.web';
import { Tag } from '~components/Tag';

describe('<Move />', () => {
  it('should enhance and render child to add move', () => {
    const { container } = renderWithSSR(
      <Move>
        <Tag
          onDismiss={() => {
            console.log('tag dismissed');
          }}
        >
          in:User
        </Tag>
      </Move>,
    );
    expect(container).toMatchSnapshot();
  });
});
