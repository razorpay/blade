import PaymentPagesFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PaymentPagesFilledIcon />', () => {
  it('should render PaymentPagesFilledIcon', () => {
    const { container } = renderWithTheme(
      <PaymentPagesFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
