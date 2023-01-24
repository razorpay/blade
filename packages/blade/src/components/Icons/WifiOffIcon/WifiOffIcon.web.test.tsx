import WifiOffIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<WifiOffIcon />', () => {
  it('should render WifiOffIcon', () => {
    const { container } = renderWithTheme(
      <WifiOffIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
