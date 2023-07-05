import EyeOffIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<EyeOffIcon />', () => {
  it('should render EyeOffIcon', () => {
    const renderTree = renderWithTheme(
      <EyeOffIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
