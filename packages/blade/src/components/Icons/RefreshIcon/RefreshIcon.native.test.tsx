import RefreshIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<RefreshIcon />', () => {
  it('should render RefreshIcon', () => {
    const renderTree = renderWithTheme(
      <RefreshIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
