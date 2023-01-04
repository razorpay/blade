import RazorpayxIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<RazorpayxIcon />', () => {
  it('should render RazorpayxIcon', () => {
    const renderTree = renderWithTheme(
      <RazorpayxIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
