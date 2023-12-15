import EyeOffIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<EyeOffIcon />', () => {
  it('should render EyeOffIcon', () => {
    const { container } = renderWithTheme(
      <EyeOffIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
