import { Spinner } from '../Spinner';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<Spinner />', () => {
  it('should render Spinner with default props', () => {
    const { toJSON } = renderWithTheme(<Spinner />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render small size Spinner', () => {
    const { toJSON } = renderWithTheme(<Spinner size="small" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render medium size Spinner', () => {
    const { toJSON } = renderWithTheme(<Spinner size="medium" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render large size Spinner', () => {
    const { toJSON } = renderWithTheme(<Spinner size="large" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render low contrast Spinner', () => {
    const { toJSON } = renderWithTheme(<Spinner contrast="low" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render high contrast Spinner', () => {
    const { toJSON } = renderWithTheme(<Spinner contrast="high" />);
    expect(toJSON()).toMatchSnapshot();
  });
});
