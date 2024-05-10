import PaymentButtonIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PaymentButtonIcon />', () => {
  it('should render PaymentButtonIcon', () => {
    const renderTree = renderWithTheme(
      <PaymentButtonIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
