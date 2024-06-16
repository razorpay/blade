import RazorpayIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<RazorpayIcon />', () => {
  it('should render RazorpayIcon', () => {
    const renderTree = renderWithTheme(
      <RazorpayIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
