import WalletFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<WalletFilledIcon />', () => {
  it('should render WalletFilledIcon', () => {
    const { container } = renderWithTheme(
      <WalletFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
