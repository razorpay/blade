import PaymentPagesFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PaymentPagesFilledIcon />', () => {
  it('should render PaymentPagesFilledIcon', () => {
    const renderTree = renderWithTheme(
      <PaymentPagesFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
