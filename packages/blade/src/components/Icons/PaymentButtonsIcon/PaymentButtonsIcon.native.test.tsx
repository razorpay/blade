import PaymentButtonsIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<PaymentButtonsIcon />', () => {
  it('should render PaymentButtonsIcon', () => {
    const renderTree = renderWithTheme(
      <PaymentButtonsIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
