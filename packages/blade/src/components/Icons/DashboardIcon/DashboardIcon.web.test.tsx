import renderWithTheme from '~utils/testing/renderWithTheme.web';

import DashboardIcon from './';

describe('<DashboardIcon />', () => {
  it('should render DashboardIcon', () => {
    const { container } = renderWithTheme(
      <DashboardIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
