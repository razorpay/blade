import React from 'react';
import { fireEvent } from '@testing-library/react';
import { EmptyState } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';
import { Button } from '~components/Button';
import { Link } from '~components/Link';

const TestAsset = (): React.ReactElement => (
  <img
    src="https://shorturl.at/M02qe"
    alt="List view asset"
    width="96px"
    height="96px"
    style={{ objectFit: 'contain' }}
  />
);

const sizes: Array<'small' | 'medium' | 'large' | 'xlarge'> = [
  'small',
  'medium',
  'large',
  'xlarge',
];

describe('<EmptyState />', () => {
  it('should render EmptyState with all props', () => {
    const { container } = renderWithTheme(
      <EmptyState
        asset={<TestAsset />}
        title="No data found"
        description="There's no data to display right now"
        size="medium"
        testID="empty-state-test"
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render EmptyState with asset only', () => {
    const { container } = renderWithTheme(<EmptyState asset={<TestAsset />} />);
    expect(container).toMatchSnapshot();
  });

  it('should render EmptyState with title only', () => {
    const { container } = renderWithTheme(<EmptyState title="No data found" />);
    expect(container).toMatchSnapshot();
  });

  it('should render EmptyState with description only', () => {
    const { container } = renderWithTheme(<EmptyState description="No data to display" />);
    expect(container).toMatchSnapshot();
  });

  sizes.forEach((size) => {
    it(`should render ${size} size EmptyState`, () => {
      const { container } = renderWithTheme(
        <EmptyState
          asset={<TestAsset />}
          title="No data found"
          description="There's no data to display right now"
          size={size}
        />,
      );
      expect(container).toMatchSnapshot();
    });
  });

  it('should render EmptyState with Button children', () => {
    const onClick = jest.fn();
    const { container, getByRole } = renderWithTheme(
      <EmptyState
        asset={<TestAsset />}
        title="No data found"
        description="There's no data to display right now"
      >
        <Button onClick={onClick}>Add Data</Button>
      </EmptyState>,
    );

    const button = getByRole('button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(container).toMatchSnapshot();
  });

  it('should render EmptyState with Link children', () => {
    const { container } = renderWithTheme(
      <EmptyState
        asset={<TestAsset />}
        title="No data found"
        description="There's no data to display right now"
      >
        <Link href="/add-data">Add Data</Link>
      </EmptyState>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <EmptyState asset={<TestAsset />} testID="empty-state-test" />,
    );
    expect(getByTestId('empty-state-test')).toBeTruthy();
  });

  it('should accept data-analytics attributes', () => {
    const { getByTestId } = renderWithTheme(
      <EmptyState
        asset={<TestAsset />}
        testID="empty-state-test"
        data-analytics-section="empty-state"
      />,
    );
    const element = getByTestId('empty-state-test');
    expect(element).toHaveAttribute('data-analytics-section', 'empty-state');
  });

  it('should be accessible', async () => {
    const { container } = renderWithTheme(
      <EmptyState
        asset={<TestAsset />}
        title="No data found"
        description="There's no data to display right now"
      />,
    );
    await assertAccessible(container);
  });
});
