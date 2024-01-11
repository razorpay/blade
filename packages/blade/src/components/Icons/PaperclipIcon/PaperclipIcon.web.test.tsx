import PaperclipIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PaperclipIcon />', () => {
  it('should render PaperclipIcon', () => {
    const { container } = renderWithTheme(
      <PaperclipIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
