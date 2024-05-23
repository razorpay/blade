import EcommerceIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<EcommerceIcon />', () => {
  it('should render EcommerceIcon', () => {
    const renderTree = renderWithTheme(
      <EcommerceIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
