import WifiIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<WifiIcon />', () => {
  it('should render WifiIcon', () => {
    const { container } = renderWithTheme(
      <WifiIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
