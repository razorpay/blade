import renderWithTheme from '../../../_helpers/testing/renderWithTheme.native';
import EyeOffIcon from '.';

describe('<EyeOffIcon />', () => {
  it('should render EyeOffIcon', () => {
    const renderTree = renderWithTheme(
      <EyeOffIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
