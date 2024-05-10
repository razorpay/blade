import CookieIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CookieIcon />', () => {
  it('should render CookieIcon', () => {
    const { container } = renderWithTheme(
      <CookieIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
