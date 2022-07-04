import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';
import EyeIcon from '.';

describe('<EyeIcon />', () => {
  it('should render EyeIcon', () => {
    const { container } = renderWithTheme(
      <EyeIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
