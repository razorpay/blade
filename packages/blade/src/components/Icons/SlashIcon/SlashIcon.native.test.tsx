import SlashIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<SlashIcon />', () => {
  it('should render SlashIcon', () => {
    const renderTree = renderWithTheme(
      <SlashIcon color="feedback.icon.gray.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
