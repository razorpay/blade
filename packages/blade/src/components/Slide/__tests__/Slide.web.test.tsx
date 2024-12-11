/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React from 'react';
import { Slide } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Tag } from '~components/Tag';

describe('<Slide />', () => {
  it('should enhance and render child to add slide', () => {
    const { container } = renderWithTheme(
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

  it('should be in document but be invisible', () => {
    const { getByText } = renderWithTheme(
      <Slide isVisible={false}>
        <Tag
          onDismiss={() => {
            console.log('tag dismissed');
          }}
          testID="tag"
        >
          in:User
        </Tag>
      </Slide>,
    );

    expect(getByText('in:User')).toBeInTheDocument();
  });

  it('should unmount and mount on basis of isVisible when shouldUnmountWhenHidden is true', () => {
    const { queryByText } = renderWithTheme(
      <Slide isVisible={false} shouldUnmountWhenHidden>
        <Tag
          onDismiss={() => {
            console.log('tag dismissed');
          }}
        >
          in:User
        </Tag>
      </Slide>,
    );

    expect(queryByText('in:User')).not.toBeInTheDocument();
  });
});
