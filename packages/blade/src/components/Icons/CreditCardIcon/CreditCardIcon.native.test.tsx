import renderWithTheme from '../../../_helpers/testing/renderWithTheme.native';
import CreditCardIcon from '.';

describe('<CreditCardIcon />', () => {
  it('should render CreditCardIcon', () => {
    const renderTree = renderWithTheme(
      <CreditCardIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
