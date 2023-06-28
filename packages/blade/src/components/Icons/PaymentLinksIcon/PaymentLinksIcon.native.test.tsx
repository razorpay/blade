import PaymentLinksIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PaymentLinksIcon />', () => {
  it('should render PaymentLinksIcon', () => {
    const renderTree = renderWithTheme(
      <PaymentLinksIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
