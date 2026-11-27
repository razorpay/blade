import React from 'react';
import { RayChatOutput } from '../RayChatOutput';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<RayChatOutput /> on React Native', () => {
  it('says it is web only for now', () => {
    expect(() => renderWithTheme(<RayChatOutput>Hi</RayChatOutput>)).toThrow(
      'RayChatOutput is not yet implemented for React Native',
    );
  });
});
