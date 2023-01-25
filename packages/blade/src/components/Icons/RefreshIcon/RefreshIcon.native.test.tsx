import RefreshIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<RefreshIcon />', () => {
  it('should render RefreshIcon', () => {
    const renderTree = renderWithTheme(
      <RefreshIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
