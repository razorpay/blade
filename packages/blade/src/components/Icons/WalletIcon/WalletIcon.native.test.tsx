import WalletIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<WalletIcon />', () => {
  it('should render WalletIcon', () => {
    const renderTree = renderWithTheme(
      <WalletIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
