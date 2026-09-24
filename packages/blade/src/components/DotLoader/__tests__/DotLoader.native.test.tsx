import type { ReactTestInstance } from 'react-test-renderer';
import { DotLoader } from '../DotLoader';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { useReducedMotion } from 'react-native-reanimated';
import {
  dotLoaderGeometry,
  dotLoaderTokens,
  REDUCED_MOTION_LIFTED_DOT_INDEX,
} from '../dotLoaderTokens';

// `react-native-reanimated` is mocked in jest-setup.native.js, so the imported
// hook is a jest mock at runtime even though its published type is a plain
// function.
const mockUseReducedMotion = useReducedMotion as jest.MockedFunction<typeof useReducedMotion>;

/**
 * Each dot is rendered by the internal `Dot` component, so `container.children`
 * hands back composites that carry no style of their own. Walk down to the host
 * views instead — `findAll` matches the container as well, so drop it.
 */
const getDotViews = (container: ReactTestInstance): ReactTestInstance[] =>
  container.findAll((node) => typeof node.type === 'string').filter((node) => node !== container);

/** The animated entry is the only one in the style array carrying a transform. */
const getDotTransform = (dot: ReactTestInstance): unknown =>
  (dot.props.style as Record<string, unknown>[]).find((style) => style && 'transform' in style)
    ?.transform;

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

  describe('reduced motion', () => {
    afterEach(() => {
      mockUseReducedMotion.mockReturnValue(false);
    });

    it('should hold the middle dot at peak transform/opacity and outer dots at rest (medium)', () => {
      mockUseReducedMotion.mockReturnValue(true);

      const { getByTestId, toJSON } = renderWithTheme(<DotLoader testID="dot-loader-test" />);
      const dots = getDotViews(getByTestId('dot-loader-test'));

      const { lift } = dotLoaderGeometry.medium;

      // Middle dot (REDUCED_MOTION_LIFTED_DOT_INDEX) at peak: full opacity
      expect(dots[REDUCED_MOTION_LIFTED_DOT_INDEX]).toHaveStyle({
        opacity: dotLoaderTokens.peakOpacity,
      });

      // Outer dots at rest: dimmed opacity
      expect(dots[0]).toHaveStyle({ opacity: dotLoaderTokens.restOpacity });
      expect(dots[2]).toHaveStyle({ opacity: dotLoaderTokens.restOpacity });

      // Verify middle dot transform is at peak lift (not resting at translateY: 0)
      expect(getDotTransform(dots[REDUCED_MOTION_LIFTED_DOT_INDEX])).toEqual([
        { translateY: -lift },
      ]);

      expect(toJSON()).toMatchSnapshot();
    });

    it('should hold the middle dot at peak transform/opacity and outer dots at rest (large)', () => {
      mockUseReducedMotion.mockReturnValue(true);

      const { getByTestId } = renderWithTheme(<DotLoader size="large" testID="dot-loader-test" />);
      const dots = getDotViews(getByTestId('dot-loader-test'));

      const { lift } = dotLoaderGeometry.large;

      // Middle dot at peak: full opacity
      expect(dots[REDUCED_MOTION_LIFTED_DOT_INDEX]).toHaveStyle({
        opacity: dotLoaderTokens.peakOpacity,
      });

      // Outer dots at rest: dimmed opacity
      expect(dots[0]).toHaveStyle({ opacity: dotLoaderTokens.restOpacity });
      expect(dots[2]).toHaveStyle({ opacity: dotLoaderTokens.restOpacity });

      // Verify middle dot transform is at peak lift for large geometry
      expect(getDotTransform(dots[REDUCED_MOTION_LIFTED_DOT_INDEX])).toEqual([
        { translateY: -lift },
      ]);
    });
  });
});
