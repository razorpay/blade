import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';
import EyeOffIcon from '.';

describe('<EyeOffIcon />', () => {
  it('should render EyeOffIcon', () => {
    const { container } = renderWithTheme(
      <EyeOffIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
