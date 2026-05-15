import renderWithTheme from '~utils/testing/renderWithTheme.web';

import BusinessBankingIcon from './';

describe('<BusinessBankingIcon />', () => {
  it('should render BusinessBankingIcon', () => {
    const { container } = renderWithTheme(
      <BusinessBankingIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
