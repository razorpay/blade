/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React from 'react';
import { Scale } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Tag } from '~components/Tag';

// Jest is unable to add style attributes to preset children.
// Thus writing major tests inside E2E

describe('<Scale />', () => {
  it('should enhance and render child to add slide', () => {
    const { container } = renderWithTheme(
      <Scale>
        <Tag
          onDismiss={() => {
            console.log('tag dismissed');
          }}
        >
          in:User
        </Tag>
      </Scale>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should be in document', () => {
    const { getByText } = renderWithTheme(
      <Scale isHighlighted={false}>
        <Tag
          onDismiss={() => {
            console.log('tag dismissed');
          }}
          testID="tag"
        >
          in:User
        </Tag>
      </Scale>,
    );

    expect(getByText('in:User')).toBeInTheDocument();
  });
});
