import BankAccountVerificationIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<BankAccountVerificationIcon />', () => {
  it('should render BankAccountVerificationIcon', () => {
    const { container } = renderWithTheme(
      <BankAccountVerificationIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
