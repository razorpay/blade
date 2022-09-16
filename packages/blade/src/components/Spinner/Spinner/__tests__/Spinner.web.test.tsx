import { Spinner } from '../Spinner';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<Spinner />', () => {
  it('should render Spinner with default props', () => {
    const { container } = renderWithTheme(<Spinner />);
    expect(container).toMatchSnapshot();
  });

  it('should render small size Spinner', () => {
    const { container } = renderWithTheme(<Spinner size="small" />);
    expect(container).toMatchSnapshot();
  });

  it('should render medium size Spinner', () => {
    const { container } = renderWithTheme(<Spinner size="medium" />);
    expect(container).toMatchSnapshot();
  });

  it('should render large size Spinner', () => {
    const { container } = renderWithTheme(<Spinner size="large" />);
    expect(container).toMatchSnapshot();
  });

  it('should render low contrast Spinner', () => {
    const { container } = renderWithTheme(<Spinner contrast="low" />);
    expect(container).toMatchSnapshot();
  });

  it('should render high contrast Spinner', () => {
    const { container } = renderWithTheme(<Spinner contrast="high" />);
    expect(container).toMatchSnapshot();
  });
});
