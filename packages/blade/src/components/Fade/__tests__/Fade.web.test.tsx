/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React from 'react';
import { Fade } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Tag } from '~components/Tag';

describe('<Fade />', () => {
  it('should enhance and render child to add fade', () => {
    const { container } = renderWithTheme(
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

  it('should be in document but be invisible', () => {
    const { getByText } = renderWithTheme(
      <Fade isVisible={false}>
        <Tag
          onDismiss={() => {
            console.log('tag dismissed');
          }}
          testID="tag"
        >
          in:User
        </Tag>
      </Fade>,
    );

    expect(getByText('in:User')).toBeInTheDocument();
  });

  it('should unmount and mount on basis of isVisible when shouldUnmountWhenHidden is true', () => {
    const { queryByText } = renderWithTheme(
      <Fade isVisible={false} shouldUnmountWhenHidden>
        <Tag
          onDismiss={() => {
            console.log('tag dismissed');
          }}
        >
          in:User
        </Tag>
      </Fade>,
    );

    expect(queryByText('in:User')).not.toBeInTheDocument();
  });
});
