import BankAccountVerificationFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<BankAccountVerificationFilledIcon />', () => {
  it('should render BankAccountVerificationFilledIcon', () => {
    const { container } = renderWithTheme(
      <BankAccountVerificationFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
