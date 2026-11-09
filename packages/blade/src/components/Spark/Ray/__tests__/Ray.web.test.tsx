import { Ray } from '../Ray';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<Ray />', () => {
  it('should render Ray with default props', () => {
    const { container } = renderWithTheme(<Ray />);
    expect(container).toMatchSnapshot();
  });

  it('should render his box at his rest size for each size', () => {
    const medium = renderWithTheme(<Ray testID="ray-medium" />);
    expect(medium.getByTestId('ray-medium')).toHaveStyle({ width: '48px' });
    const small = renderWithTheme(<Ray testID="ray-small" size="small" />);
    expect(small.getByTestId('ray-small')).toHaveStyle({ width: '38px' });
  });

  it('should be hidden from assistive tech when no accessibilityLabel is passed', () => {
    const { getByTestId } = renderWithTheme(<Ray testID="ray-test" />);
    expect(getByTestId('ray-test')).toHaveAttribute('aria-hidden', 'true');
  });

  it('should expose an image role when accessibilityLabel is passed', () => {
    const { getByRole } = renderWithTheme(
      <Ray accessibilityLabel="Ray is searching" state="searching" />,
    );
    const ray = getByRole('img');
    expect(ray).toHaveAttribute('aria-label', 'Ray is searching');
    expect(ray).not.toHaveAttribute('aria-hidden');
  });

  it('should hide his label from assistive tech while he is not visible', () => {
    const { getByTestId, queryByRole } = renderWithTheme(
      <Ray testID="ray-test" accessibilityLabel="Ray is searching" isVisible={false} />,
    );
    expect(queryByRole('img')).not.toBeInTheDocument();
    expect(getByTestId('ray-test')).toHaveAttribute('aria-hidden', 'true');
  });

  it('should render without a canvas to draw on (jsdom) for every state', () => {
    const states = ['idle', 'searching', 'calling', 'writing', 'working'] as const;
    states.forEach((state) => {
      const { getByTestId, unmount } = renderWithTheme(
        <Ray testID={`ray-${state}`} state={state} isVisible={state !== 'working'} />,
      );
      expect(getByTestId(`ray-${state}`)).toBeInTheDocument();
      unmount();
    });
  });
});
