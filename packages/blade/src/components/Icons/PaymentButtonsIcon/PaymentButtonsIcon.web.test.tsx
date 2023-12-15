import PaymentButtonsIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PaymentButtonsIcon />', () => {
  it('should render PaymentButtonsIcon', () => {
    const { container } = renderWithTheme(
      <PaymentButtonsIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
