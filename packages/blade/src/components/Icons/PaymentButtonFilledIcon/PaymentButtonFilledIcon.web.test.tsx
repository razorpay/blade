import PaymentButtonFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PaymentButtonFilledIcon />', () => {
  it('should render PaymentButtonFilledIcon', () => {
    const { container } = renderWithTheme(
      <PaymentButtonFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
