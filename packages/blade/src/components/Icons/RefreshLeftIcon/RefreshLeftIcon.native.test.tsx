import RefreshLeftIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<RefreshLeftIcon />', () => {
  it('should render RefreshLeftIcon', () => {
    const renderTree = renderWithTheme(
      <RefreshLeftIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
