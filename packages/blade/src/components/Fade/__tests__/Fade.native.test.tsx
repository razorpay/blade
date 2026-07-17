import React from 'react';
import { Fade } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { Tag } from '~components/Tag';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Fade /> (native)', () => {
  it('should enhance and render child to add fade', () => {
    const { toJSON } = renderWithTheme(
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
    expect(toJSON()).toMatchSnapshot();
  });

  it('should be mounted but invisible when isVisible is false', () => {
    const { queryByText } = renderWithTheme(
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

    // Native has no AnimatePresence: the node stays mounted while it animates to the exit variant.
    expect(queryByText('in:User')).toBeTruthy();
  });

  it('should unmount when isVisible is false and shouldUnmountWhenHidden is true', () => {
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

    expect(queryByText('in:User')).toBeNull();
  });
});
