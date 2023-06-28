import EyeIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<EyeIcon />', () => {
  it('should render EyeIcon', () => {
    const renderTree = renderWithTheme(
      <EyeIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
