import { BaseSpinner } from '../BaseSpinner';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<BaseSpinner />', () => {
  it('should render BaseSpinner with default props', () => {
    const { container } = renderWithTheme(<BaseSpinner />);
    expect(container).toMatchSnapshot();
  });

  it('should render small size BaseSpinner', () => {
    const { container } = renderWithTheme(<BaseSpinner size="small" />);
    expect(container).toMatchSnapshot();
  });

  it('should render medium size BaseSpinner', () => {
    const { container } = renderWithTheme(<BaseSpinner size="medium" />);
    expect(container).toMatchSnapshot();
  });

  it('should render large size BaseSpinner', () => {
    const { container } = renderWithTheme(<BaseSpinner size="large" />);
    expect(container).toMatchSnapshot();
  });

  it('should render low contrast BaseSpinner', () => {
    const { container } = renderWithTheme(<BaseSpinner contrast="low" />);
    expect(container).toMatchSnapshot();
  });

  it('should render high contrast BaseSpinner', () => {
    const { container } = renderWithTheme(<BaseSpinner contrast="high" />);
    expect(container).toMatchSnapshot();
  });

  it('should render low contrast positive intent BaseSpinner', () => {
    const { container } = renderWithTheme(<BaseSpinner intent="positive" contrast="low" />);
    expect(container).toMatchSnapshot();
  });

  it('should render high contrast positive intent BaseSpinner', () => {
    const { container } = renderWithTheme(<BaseSpinner intent="positive" contrast="high" />);
    expect(container).toMatchSnapshot();
  });

  it('should render low contrast negative intent BaseSpinner', () => {
    const { container } = renderWithTheme(<BaseSpinner intent="negative" contrast="low" />);
    expect(container).toMatchSnapshot();
  });

  it('should render high contrast negative intent BaseSpinner', () => {
    const { container } = renderWithTheme(<BaseSpinner intent="negative" contrast="high" />);
    expect(container).toMatchSnapshot();
  });
  it('should render low contrast information intent BaseSpinner', () => {
    const { container } = renderWithTheme(<BaseSpinner intent="information" contrast="low" />);
    expect(container).toMatchSnapshot();
  });

  it('should render high contrast information intent BaseSpinner', () => {
    const { container } = renderWithTheme(<BaseSpinner intent="information" contrast="high" />);
    expect(container).toMatchSnapshot();
  });
  it('should render low contrast notice intent BaseSpinner', () => {
    const { container } = renderWithTheme(<BaseSpinner intent="notice" contrast="low" />);
    expect(container).toMatchSnapshot();
  });

  it('should render high contrast notice intent BaseSpinner', () => {
    const { container } = renderWithTheme(<BaseSpinner intent="notice" contrast="high" />);
    expect(container).toMatchSnapshot();
  });

  it('should render low contrast neutral intent BaseSpinner', () => {
    const { container } = renderWithTheme(<BaseSpinner intent="neutral" contrast="low" />);
    expect(container).toMatchSnapshot();
  });

  it('should render high contrast neutral intent BaseSpinner', () => {
    const { container } = renderWithTheme(<BaseSpinner intent="neutral" contrast="high" />);
    expect(container).toMatchSnapshot();
  });
});
