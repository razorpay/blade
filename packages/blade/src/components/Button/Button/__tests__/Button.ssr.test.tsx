import Button from '../Button';
import renderWithSSR from '~src/_helpers/testing/renderWithSSR.web';
import { CreditCardIcon } from '~components/Icons';

describe('<Button />', () => {
  it('should render button with icon with default iconPosition', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithSSR(<Button icon={CreditCardIcon}>{buttonText}</Button>);
    expect(container).toMatchSnapshot();
  });
});
