import EyeIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<EyeIcon />', () => {
  it('should render EyeIcon', () => {
    const { container } = renderWithTheme(
      <EyeIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
