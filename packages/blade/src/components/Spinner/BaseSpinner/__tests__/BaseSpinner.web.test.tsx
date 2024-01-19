import type { BaseSpinnerProps } from '../BaseSpinner';
import { BaseSpinner } from '../BaseSpinner';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';

const colors: BaseSpinnerProps['color'][] = [
  'primary',
  'white',
  'positive',
  'negative',
  'information',
  'notice',
  'neutral',
];

describe('<BaseSpinner />', () => {
  it('should render BaseSpinner with default props', () => {
    const { container } = renderWithTheme(<BaseSpinner accessibilityLabel="Loading" />);
    expect(container).toMatchSnapshot();
  });

  it('should render medium size BaseSpinner', () => {
    const { container } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" size="medium" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render large size BaseSpinner', () => {
    const { container } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render xlarge size BaseSpinner', () => {
    const { container } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" size="xlarge" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render low contrast BaseSpinner with right label', () => {
    const { container } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" label="Loading" labelPosition="right" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render high contrast BaseSpinner with bottom label', () => {
    const { container } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" label="Loading" labelPosition="bottom" />,
    );
    expect(container).toMatchSnapshot();
  });

  colors.forEach((color) => {
    it(`should render ${color} color BaseSpinner`, () => {
      const { container } = renderWithTheme(
        <BaseSpinner accessibilityLabel="Loading" color={color} />,
      );
      expect(container).toMatchSnapshot();
    });
  });

  it('should not have accessibility violations', async () => {
    const { container } = renderWithTheme(<BaseSpinner accessibilityLabel="Loading" />);
    await assertAccessible(container);
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" testID="base-spinner-test" />,
    );
    expect(getByTestId('base-spinner-test')).toBeTruthy();
  });
});
