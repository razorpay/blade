import MessageCircleIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<MessageCircleIcon />', () => {
  it('should render MessageCircleIcon', () => {
    const renderTree = renderWithTheme(
      <MessageCircleIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
