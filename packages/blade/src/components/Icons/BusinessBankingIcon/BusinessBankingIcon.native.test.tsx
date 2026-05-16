import renderWithTheme from '~utils/testing/renderWithTheme.native';

import BusinessBankingIcon from '.';

describe('<BusinessBankingIcon />', () => {
  it('should render BusinessBankingIcon', () => {
    const renderTree = renderWithTheme(
      <BusinessBankingIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
