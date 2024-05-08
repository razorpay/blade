import RazorpayXIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<RazorpayXIcon />', () => {
  it('should render RazorpayXIcon', () => {
    const renderTree = renderWithTheme(
      <RazorpayXIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
