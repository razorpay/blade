import RazorpayIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<RazorpayIcon />', () => {
  it('should render RazorpayIcon', () => {
    const renderTree = renderWithTheme(
      <RazorpayIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
