import WifiOffIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<WifiOffIcon />', () => {
  it('should render WifiOffIcon', () => {
    const { container } = renderWithTheme(
      <WifiOffIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
