import RazorpayTrustIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<RazorpayTrustIcon />', () => {
  it('should render RazorpayTrustIcon', () => {
    const renderTree = renderWithTheme(
      <RazorpayTrustIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
