import renderWithTheme from '~utils/testing/renderWithTheme.web';

import BankAccountVerificationFilledIcon from './';

describe('<BankAccountVerificationFilledIcon />', () => {
  it('should render BankAccountVerificationFilledIcon', () => {
    const { container } = renderWithTheme(
      <BankAccountVerificationFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
