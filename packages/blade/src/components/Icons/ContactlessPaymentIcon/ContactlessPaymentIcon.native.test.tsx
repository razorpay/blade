import ContactlessPaymentIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ContactlessPaymentIcon />', () => {
  it('should render ContactlessPaymentIcon', () => {
    const renderTree = renderWithTheme(
      <ContactlessPaymentIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
