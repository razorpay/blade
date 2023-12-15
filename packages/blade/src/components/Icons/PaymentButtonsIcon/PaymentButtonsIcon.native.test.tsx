import PaymentButtonsIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PaymentButtonsIcon />', () => {
  it('should render PaymentButtonsIcon', () => {
    const renderTree = renderWithTheme(
      <PaymentButtonsIcon color="feedback.icon.gray.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
