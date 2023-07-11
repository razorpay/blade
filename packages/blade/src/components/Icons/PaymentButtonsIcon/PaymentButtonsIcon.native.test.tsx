import PaymentButtonsIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PaymentButtonsIcon />', () => {
  it('should render PaymentButtonsIcon', () => {
    const renderTree = renderWithTheme(
      <PaymentButtonsIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
