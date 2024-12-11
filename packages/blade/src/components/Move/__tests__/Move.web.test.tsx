/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React from 'react';
import { Move } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Tag } from '~components/Tag';

describe('<Move />', () => {
  it('should enhance and render child to add move', () => {
    const { container } = renderWithTheme(
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

  it('should be in document but be invisible', () => {
    const { getByText } = renderWithTheme(
      <Move isVisible={false}>
        <Tag
          onDismiss={() => {
            console.log('tag dismissed');
          }}
          testID="tag"
        >
          in:User
        </Tag>
      </Move>,
    );

    expect(getByText('in:User')).toBeInTheDocument();
  });

  it('should unmount and mount on basis of isVisible when shouldUnmountWhenHidden is true', () => {
    const { queryByText } = renderWithTheme(
      <Move isVisible={false} shouldUnmountWhenHidden>
        <Tag
          onDismiss={() => {
            console.log('tag dismissed');
          }}
        >
          in:User
        </Tag>
      </Move>,
    );

    expect(queryByText('in:User')).not.toBeInTheDocument();
  });
});
