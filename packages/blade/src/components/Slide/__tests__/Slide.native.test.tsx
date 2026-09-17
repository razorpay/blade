import React from 'react';
import { act } from '@testing-library/react-native';
import { Slide } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { Tag } from '~components/Tag';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Slide /> (native)', () => {
  it('should enhance and render child to add slide', () => {
    const { toJSON } = renderWithTheme(
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
    expect(toJSON()).toMatchSnapshot();
  });

  it('should be mounted but animate out when isVisible is false', () => {
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

    // Without `shouldUnmountWhenHidden`, the node stays mounted (only the exit animation runs).
    expect(getByText('in:User')).toBeTruthy();
  });

  it('should unmount and mount on basis of isVisible when shouldUnmountWhenHidden is true', async () => {
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

    // The exit animation completes synchronously (mocked reanimated), then the child is unmounted on
    // the next frame via requestAnimationFrame. Flush that frame inside `act` before asserting.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 32));
    });

    expect(queryByText('in:User')).toBeNull();
  });
});
