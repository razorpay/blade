import renderWithTheme from '~utils/testing/renderWithTheme.web';

import RouteIcon from './';

describe('<RouteIcon />', () => {
  it('should render RouteIcon', () => {
    const { container } = renderWithTheme(
      <RouteIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
