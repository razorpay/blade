import { DotLoader } from '../DotLoader';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<DotLoader />', () => {
  it('should render DotLoader with default props', () => {
    const { toJSON } = renderWithTheme(<DotLoader />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render DotLoader with a color token', () => {
    const { toJSON } = renderWithTheme(<DotLoader color="interactive.icon.negative.subtle" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should be hidden from assistive tech when no accessibilityLabel is passed', () => {
    const { getByTestId } = renderWithTheme(<DotLoader testID="dot-loader-test" />);
    expect(getByTestId('dot-loader-test')).toHaveProp('accessibilityElementsHidden', true);
  });

  it('should expose a progressbar role when accessibilityLabel is passed', () => {
    const { getByTestId } = renderWithTheme(
      <DotLoader accessibilityLabel="Loading results" testID="dot-loader-test" />,
    );
    const loader = getByTestId('dot-loader-test');
    expect(loader).toHaveProp('accessibilityRole', 'progressbar');
    expect(loader).toHaveProp('accessibilityLabel', 'Loading results');
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(<DotLoader testID="dot-loader-test" />);
    expect(getByTestId('dot-loader-test')).toBeTruthy();
  });

  it('should render DotLoader at the large size', () => {
    const { toJSON } = renderWithTheme(<DotLoader size="large" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should size the large box at 1.5x the medium box', () => {
    const { getByTestId: getMedium } = renderWithTheme(<DotLoader testID="medium" />);
    const { getByTestId: getLarge } = renderWithTheme(<DotLoader size="large" testID="large" />);

    expect(getMedium('medium')).toHaveStyle({ width: 24, height: 24 });
    expect(getLarge('large')).toHaveStyle({ width: 36, height: 36 });
  });
});
