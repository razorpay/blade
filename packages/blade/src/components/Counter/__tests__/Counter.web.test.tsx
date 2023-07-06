import { Counter } from '../Counter';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<Counter />', () => {
  it('should render Counter with default props', () => {
    const { container } = renderWithTheme(<Counter value={20} />);
    expect(container).toMatchSnapshot();
  });

  it('should limit value with max prop', () => {
    const { getByText } = renderWithTheme(<Counter value={20} max={10} />);
    expect(getByText('10+')).toBeTruthy();
  });

  it('should render small size Counter', () => {
    const { container } = renderWithTheme(<Counter size="small" value={20} />);
    expect(container).toMatchSnapshot();
  });

  it('should render medium size Counter', () => {
    const { container } = renderWithTheme(<Counter size="medium" value={20} />);
    expect(container).toMatchSnapshot();
  });

  it('should render large size Counter', () => {
    const { container } = renderWithTheme(<Counter size="large" value={20} />);
    expect(container).toMatchSnapshot();
  });

  it('should render low contrast positive variant Counter', () => {
    const { container } = renderWithTheme(<Counter variant="positive" contrast="low" value={20} />);
    expect(container).toMatchSnapshot();
  });

  it('should render high contrast positive variant Counter', () => {
    const { container } = renderWithTheme(
      <Counter variant="positive" contrast="high" value={20} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render low contrast negative variant Counter', () => {
    const { container } = renderWithTheme(<Counter variant="negative" contrast="low" value={20} />);
    expect(container).toMatchSnapshot();
  });

  it('should render high contrast negative variant Counter', () => {
    const { container } = renderWithTheme(
      <Counter variant="negative" contrast="high" value={20} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render low contrast notice variant Counter', () => {
    const { container } = renderWithTheme(<Counter variant="notice" contrast="low" value={20} />);
    expect(container).toMatchSnapshot();
  });

  it('should render high contrast notice variant Counter', () => {
    const { container } = renderWithTheme(<Counter variant="notice" contrast="high" value={20} />);
    expect(container).toMatchSnapshot();
  });

  it('should render low contrast information variant Counter', () => {
    const { container } = renderWithTheme(
      <Counter variant="information" contrast="low" value={20} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render high contrast information variant Counter', () => {
    const { container } = renderWithTheme(
      <Counter variant="information" contrast="high" value={20} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render low contrast neutral variant Counter', () => {
    const { container } = renderWithTheme(<Counter variant="neutral" contrast="low" value={20} />);
    expect(container).toMatchSnapshot();
  });

  it('should render high contrast neutral variant Counter', () => {
    const { container } = renderWithTheme(<Counter variant="neutral" contrast="high" value={20} />);
    expect(container).toMatchSnapshot();
  });

  it('should render low contrast blue variant Counter', () => {
    const { container } = renderWithTheme(<Counter variant="blue" contrast="low" value={20} />);
    expect(container).toMatchSnapshot();
  });

  it('should render high contrast blue variant Counter', () => {
    const { container } = renderWithTheme(<Counter variant="blue" contrast="high" value={20} />);
    expect(container).toMatchSnapshot();
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(<Counter value={20} testID="counter-test" />);
    expect(getByTestId('counter-test')).toBeTruthy();
  });
});
