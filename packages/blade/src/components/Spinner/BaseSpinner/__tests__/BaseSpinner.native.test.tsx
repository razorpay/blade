import type { BaseSpinnerProps } from '../BaseSpinner';
import { BaseSpinner } from '../BaseSpinner';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

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
    const { toJSON } = renderWithTheme(<BaseSpinner accessibilityLabel="Loading" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render medium size BaseSpinner', () => {
    const { toJSON } = renderWithTheme(<BaseSpinner accessibilityLabel="Loading" size="medium" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render large size BaseSpinner', () => {
    const { toJSON } = renderWithTheme(<BaseSpinner accessibilityLabel="Loading" size="large" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render xlarge size BaseSpinner', () => {
    const { toJSON } = renderWithTheme(<BaseSpinner accessibilityLabel="Loading" size="xlarge" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render low contrast BaseSpinner with right label', () => {
    const { toJSON } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" label="Loading" labelPosition="right" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render high contrast BaseSpinner with bottom label', () => {
    const { toJSON } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" label="Loading" labelPosition="bottom" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  colors.forEach((color) => {
    it(`should render ${color} color BaseSpinner`, () => {
      const { toJSON } = renderWithTheme(
        <BaseSpinner accessibilityLabel="Loading" color={color} />,
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" testID="base-spinner-test" />,
    );
    expect(getByTestId('base-spinner-test')).toBeTruthy();
  });
});
