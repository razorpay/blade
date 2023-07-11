import PaymentPagesIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PaymentPagesIcon />', () => {
  it('should render PaymentPagesIcon', () => {
    const renderTree = renderWithTheme(
      <PaymentPagesIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
