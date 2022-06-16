import renderWithTheme from '../../../_helpers/testing/renderWithTheme.native';
import EyeIcon from '.';

describe('<EyeIcon />', () => {
  it('should render EyeIcon', () => {
    const renderTree = renderWithTheme(
      <EyeIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
