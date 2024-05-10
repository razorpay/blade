import ItalicIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ItalicIcon />', () => {
  it('should render ItalicIcon', () => {
    const renderTree = renderWithTheme(
      <ItalicIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
