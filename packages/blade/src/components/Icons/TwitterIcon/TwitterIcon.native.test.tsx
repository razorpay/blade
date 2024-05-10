import TwitterIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<TwitterIcon />', () => {
  it('should render TwitterIcon', () => {
    const renderTree = renderWithTheme(
      <TwitterIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
