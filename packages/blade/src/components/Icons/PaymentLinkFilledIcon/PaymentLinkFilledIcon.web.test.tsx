import PaymentLinkFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PaymentLinkFilledIcon />', () => {
  it('should render PaymentLinkFilledIcon', () => {
    const { container } = renderWithTheme(
      <PaymentLinkFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
