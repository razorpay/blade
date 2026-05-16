import renderWithTheme from '~utils/testing/renderWithTheme.web';

import RoutesIcon from '.';

describe('<RoutesIcon />', () => {
  it('should render RoutesIcon', () => {
    const { container } = renderWithTheme(
      <RoutesIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
