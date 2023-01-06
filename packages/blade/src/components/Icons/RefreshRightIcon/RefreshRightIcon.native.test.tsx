import RefreshRightIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<RefreshRightIcon />', () => {
  it('should render RefreshRightIcon', () => {
    const renderTree = renderWithTheme(
      <RefreshRightIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
