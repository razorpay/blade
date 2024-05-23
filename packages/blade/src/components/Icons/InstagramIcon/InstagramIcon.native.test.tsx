import InstagramIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<InstagramIcon />', () => {
  it('should render InstagramIcon', () => {
    const renderTree = renderWithTheme(
      <InstagramIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
