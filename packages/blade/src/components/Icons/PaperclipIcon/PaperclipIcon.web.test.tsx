import PaperclipIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<PaperclipIcon />', () => {
  it('should render PaperclipIcon', () => {
    const { container } = renderWithTheme(
      <PaperclipIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
