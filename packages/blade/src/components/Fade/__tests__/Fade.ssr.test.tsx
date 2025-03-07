/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React from 'react';
import { Fade } from '../index';
import renderWithSSR from '~utils/testing/renderWithSSR.web';
import { Tag } from '~components/Tag';

describe('<Fade />', () => {
  it('should enhance and render child to add fade', () => {
    const { container } = renderWithSSR(
      <Fade>
        <Tag
          onDismiss={() => {
            console.log('tag dismissed');
          }}
        >
          in:User
        </Tag>
      </Fade>,
    );
    expect(container).toMatchSnapshot();
  });
});
