import renderWithTheme from '~utils/testing/renderWithTheme.web';

import BankAccountVerificationIcon from './';

describe('<BankAccountVerificationIcon />', () => {
  it('should render BankAccountVerificationIcon', () => {
    const { container } = renderWithTheme(
      <BankAccountVerificationIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
