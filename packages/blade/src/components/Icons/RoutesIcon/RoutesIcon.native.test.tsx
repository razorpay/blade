import RoutesIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<RoutesIcon />', () => {
  it('should render RoutesIcon', () => {
    const renderTree = renderWithTheme(
      <RoutesIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
