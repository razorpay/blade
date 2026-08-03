import React from 'react';
import { Move } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { Tag } from '~components/Tag';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Move /> (native)', () => {
  it('should enhance and render child to add move', () => {
    const { toJSON } = renderWithTheme(
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
    expect(toJSON()).toMatchSnapshot();
  });

  it('should be mounted but invisible when isVisible is false', () => {
    const { queryByText } = renderWithTheme(
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

    // Native has no AnimatePresence: the node stays mounted while it animates to the exit variant.
    expect(queryByText('in:User')).toBeTruthy();
  });

  it('should unmount when isVisible is false and shouldUnmountWhenHidden is true', () => {
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

    expect(queryByText('in:User')).toBeNull();
  });
});
