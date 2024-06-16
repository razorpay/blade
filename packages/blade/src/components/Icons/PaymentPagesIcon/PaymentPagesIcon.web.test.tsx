import PaymentPagesIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PaymentPagesIcon />', () => {
  it('should render PaymentPagesIcon', () => {
    const { container } = renderWithTheme(
      <PaymentPagesIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
