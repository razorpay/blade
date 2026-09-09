import RazorpayTrustIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<RazorpayTrustIcon />', () => {
  it('should render RazorpayTrustIcon', () => {
    const { container } = renderWithTheme(
      <RazorpayTrustIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
