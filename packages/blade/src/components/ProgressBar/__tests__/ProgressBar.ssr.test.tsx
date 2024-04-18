import React from 'react';
import { ProgressBar } from '..';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<ProgressBar />', () => {
  it('should render linear ProgressBar with default properties', () => {
    const { container } = renderWithSSR(
      <ProgressBar variant="linear" type="progress" value={20} />,
    );
    expect(container).toMatchSnapshot();
  });
});
