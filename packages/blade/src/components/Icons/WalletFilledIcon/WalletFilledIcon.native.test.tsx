import WalletFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<WalletFilledIcon />', () => {
  it('should render WalletFilledIcon', () => {
    const renderTree = renderWithTheme(
      <WalletFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
