import PaymentButtonIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PaymentButtonIcon />', () => {
  it('should render PaymentButtonIcon', () => {
    const { container } = renderWithTheme(
      <PaymentButtonIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
