import BankIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<BankIcon />', () => {
  it('should render CloseIcon', () => {
    const { container } = renderWithTheme(
      <BankIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
