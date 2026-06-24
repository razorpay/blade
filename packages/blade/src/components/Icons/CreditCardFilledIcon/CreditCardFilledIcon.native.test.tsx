import CreditCardFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CreditCardFilledIcon />', () => {
  it('should render CreditCardFilledIcon', () => {
    const renderTree = renderWithTheme(
      <CreditCardFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
