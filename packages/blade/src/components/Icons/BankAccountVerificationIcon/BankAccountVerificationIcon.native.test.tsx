import renderWithTheme from '~utils/testing/renderWithTheme.native';

import BankAccountVerificationIcon from '.';

describe('<BankAccountVerificationIcon />', () => {
  it('should render BankAccountVerificationIcon', () => {
    const renderTree = renderWithTheme(
      <BankAccountVerificationIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
