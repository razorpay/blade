import React from 'react';
import { Scale } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { Tag } from '~components/Tag';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Scale /> (native)', () => {
  it('should enhance and render child to add scale', () => {
    const { toJSON } = renderWithTheme(
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
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render child when isHighlighted is false', () => {
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

    expect(getByText('in:User')).toBeTruthy();
  });

  it('should render child with tap trigger (engine wraps in Pressable)', () => {
    const { getByText } = renderWithTheme(
      <Scale motionTriggers={['tap']} variant="scale-down">
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

    expect(getByText('in:User')).toBeTruthy();
  });
});
