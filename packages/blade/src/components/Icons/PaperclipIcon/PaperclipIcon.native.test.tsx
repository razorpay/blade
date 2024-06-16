import PaperclipIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PaperclipIcon />', () => {
  it('should render PaperclipIcon', () => {
    const renderTree = renderWithTheme(
      <PaperclipIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
