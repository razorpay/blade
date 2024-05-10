import BusinessBankingIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<BusinessBankingIcon />', () => {
  it('should render BusinessBankingIcon', () => {
    const renderTree = renderWithTheme(
      <BusinessBankingIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
