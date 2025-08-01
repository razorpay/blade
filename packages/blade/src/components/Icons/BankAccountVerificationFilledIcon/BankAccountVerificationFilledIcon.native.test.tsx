import BankAccountVerificationFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<BankAccountVerificationFilledIcon />', () => {
  it('should render BankAccountVerificationFilledIcon', () => {
    const renderTree = renderWithTheme(
      <BankAccountVerificationFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
