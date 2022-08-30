import { BaseSpinner } from '../BaseSpinner';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<BaseSpinner />', () => {
  it('should render BaseSpinner with default props', () => {
    const { toJSON } = renderWithTheme(<BaseSpinner />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render small size BaseSpinner', () => {
    const { toJSON } = renderWithTheme(<BaseSpinner size="small" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render medium size BaseSpinner', () => {
    const { toJSON } = renderWithTheme(<BaseSpinner size="medium" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render large size BaseSpinner', () => {
    const { toJSON } = renderWithTheme(<BaseSpinner size="large" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render low contrast BaseSpinner', () => {
    const { toJSON } = renderWithTheme(<BaseSpinner contrast="low" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render high contrast BaseSpinner', () => {
    const { toJSON } = renderWithTheme(<BaseSpinner contrast="high" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render low contrast positive intent BaseSpinner', () => {
    const { toJSON } = renderWithTheme(<BaseSpinner intent="positive" contrast="low" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render high contrast positive intent BaseSpinner', () => {
    const { toJSON } = renderWithTheme(<BaseSpinner intent="positive" contrast="high" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render low contrast negative intent BaseSpinner', () => {
    const { toJSON } = renderWithTheme(<BaseSpinner intent="negative" contrast="low" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render high contrast negative intent BaseSpinner', () => {
    const { toJSON } = renderWithTheme(<BaseSpinner intent="negative" contrast="high" />);
    expect(toJSON()).toMatchSnapshot();
  });
  it('should render low contrast information intent BaseSpinner', () => {
    const { toJSON } = renderWithTheme(<BaseSpinner intent="information" contrast="low" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render high contrast information intent BaseSpinner', () => {
    const { toJSON } = renderWithTheme(<BaseSpinner intent="information" contrast="high" />);
    expect(toJSON()).toMatchSnapshot();
  });
  it('should render low contrast notice intent BaseSpinner', () => {
    const { toJSON } = renderWithTheme(<BaseSpinner intent="notice" contrast="low" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render high contrast notice intent BaseSpinner', () => {
    const { toJSON } = renderWithTheme(<BaseSpinner intent="notice" contrast="high" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render low contrast neutral intent BaseSpinner', () => {
    const { toJSON } = renderWithTheme(<BaseSpinner intent="neutral" contrast="low" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render high contrast neutral intent BaseSpinner', () => {
    const { toJSON } = renderWithTheme(<BaseSpinner intent="neutral" contrast="high" />);
    expect(toJSON()).toMatchSnapshot();
  });
});
