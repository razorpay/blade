import CreditCardIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CreditCardIcon />', () => {
  it('should render CreditCardIcon', () => {
    const renderTree = renderWithTheme(
      <CreditCardIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
