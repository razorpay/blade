import { Counter } from '../Counter';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<Counter />', () => {
  it('should render Counter with default props', () => {
    const { toJSON } = renderWithTheme(<Counter value={20} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should limit value with max prop', () => {
    const { getByText } = renderWithTheme(<Counter value={20} max={10} />);
    expect(getByText('10+')).toBeTruthy();
  });

  it('should render small size Counter', () => {
    const { toJSON } = renderWithTheme(<Counter size="small" value={20} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render medium size Counter', () => {
    const { toJSON } = renderWithTheme(<Counter size="medium" value={20} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render low contrast positive intent Counter', () => {
    const { toJSON } = renderWithTheme(<Counter intent="positive" contrast="low" value={20} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render high contrast positive intent Counter', () => {
    const { toJSON } = renderWithTheme(<Counter intent="positive" contrast="high" value={20} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render low contrast negative intent Counter', () => {
    const { toJSON } = renderWithTheme(<Counter intent="negative" contrast="low" value={20} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render high contrast negative intent Counter', () => {
    const { toJSON } = renderWithTheme(<Counter intent="negative" contrast="high" value={20} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render low contrast notice intent Counter', () => {
    const { toJSON } = renderWithTheme(<Counter intent="notice" contrast="low" value={20} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render high contrast notice intent Counter', () => {
    const { toJSON } = renderWithTheme(<Counter intent="notice" contrast="high" value={20} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render low contrast information intent Counter', () => {
    const { toJSON } = renderWithTheme(<Counter intent="information" contrast="low" value={20} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render high contrast information intent Counter', () => {
    const { toJSON } = renderWithTheme(<Counter intent="information" contrast="high" value={20} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render low contrast neutral intent Counter', () => {
    const { toJSON } = renderWithTheme(<Counter intent="neutral" contrast="low" value={20} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render high contrast neutral intent Counter', () => {
    const { toJSON } = renderWithTheme(<Counter intent="neutral" contrast="high" value={20} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
