import EcommerceFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<EcommerceFilledIcon />', () => {
  it('should render EcommerceFilledIcon', () => {
    const renderTree = renderWithTheme(
      <EcommerceFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
