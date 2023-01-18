import DashboardIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<DashboardIcon />', () => {
  it('should render DashboardIcon', () => {
    const { container } = renderWithTheme(
      <DashboardIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
