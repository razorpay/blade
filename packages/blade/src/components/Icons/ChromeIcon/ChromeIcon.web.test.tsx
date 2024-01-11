import ChromeIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ChromeIcon />', () => {
  it('should render ChromeIcon', () => {
    const { container } = renderWithTheme(
      <ChromeIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
