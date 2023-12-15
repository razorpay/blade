import RazorpayIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<RazorpayIcon />', () => {
  it('should render RazorpayIcon', () => {
    const { container } = renderWithTheme(
      <RazorpayIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
