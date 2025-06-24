import React from 'react';
import { EmptyState } from '../EmptyState';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

const TestAsset = (): React.ReactElement => (
  <img
    src="https://shorturl.at/5z72G"
    alt="List view asset"
    width="90px"
    height="90px"
    style={{ objectFit: 'contain' }}
  />
);

describe('<EmptyState /> SSR', () => {
  it('should render EmptyState on server', () => {
    const { container } = renderWithSSR(
      <EmptyState
        asset={<TestAsset />}
        title="No data found"
        description="There's no data to display right now"
        size="medium"
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render EmptyState with minimal props on server', () => {
    const { container } = renderWithSSR(<EmptyState title="No data found" />);
    expect(container).toMatchSnapshot();
  });
});
