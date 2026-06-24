import CreditCardFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CreditCardFilledIcon />', () => {
  it('should render CreditCardFilledIcon', () => {
    const { container } = renderWithTheme(
      <CreditCardFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
