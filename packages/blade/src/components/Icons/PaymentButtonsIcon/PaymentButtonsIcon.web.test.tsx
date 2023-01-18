import PaymentButtonsIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<PaymentButtonsIcon />', () => {
  it('should render PaymentButtonsIcon', () => {
    const { container } = renderWithTheme(
      <PaymentButtonsIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
