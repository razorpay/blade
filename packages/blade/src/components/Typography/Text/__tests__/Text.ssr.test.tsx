import React from 'react';

import renderWithSSR from '~utils/testing/renderWithSSR.web';

import { Text } from '../';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Text />', () => {
  it('should render Text on server', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithSSR(<Text>{displayText}</Text>);
    expect(container).toMatchSnapshot();
  });
});
