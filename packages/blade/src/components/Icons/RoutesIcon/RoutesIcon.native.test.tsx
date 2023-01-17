import RoutesIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<RoutesIcon />', () => {
  it('should render RoutesIcon', () => {
    const renderTree = renderWithTheme(
      <RoutesIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
