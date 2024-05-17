import WalletIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<WalletIcon />', () => {
  it('should render WalletIcon', () => {
    const { container } = renderWithTheme(
      <WalletIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
