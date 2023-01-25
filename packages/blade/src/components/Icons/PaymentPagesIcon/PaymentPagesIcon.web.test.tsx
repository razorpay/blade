import PaymentPagesIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<PaymentPagesIcon />', () => {
  it('should render PaymentPagesIcon', () => {
    const { container } = renderWithTheme(
      <PaymentPagesIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
