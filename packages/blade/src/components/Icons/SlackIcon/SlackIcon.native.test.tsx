import SlackIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<SlackIcon />', () => {
  it('should render SlackIcon', () => {
    const renderTree = renderWithTheme(
      <SlackIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
