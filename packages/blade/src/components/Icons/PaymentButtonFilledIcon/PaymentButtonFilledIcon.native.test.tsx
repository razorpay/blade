import PaymentButtonFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PaymentButtonFilledIcon />', () => {
  it('should render PaymentButtonFilledIcon', () => {
    const renderTree = renderWithTheme(
      <PaymentButtonFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
