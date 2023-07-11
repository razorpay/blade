import RazorpayXIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<RazorpayXIcon />', () => {
  it('should render RazorpayXIcon', () => {
    const { container } = renderWithTheme(
      <RazorpayXIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
