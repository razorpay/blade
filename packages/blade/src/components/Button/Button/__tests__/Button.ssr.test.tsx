import Button from '../Button';
import renderWithSSR from '~src/_helpers/testing/renderWithSSR.web';
import { CreditCardIcon } from '~components/Icons';

describe('<Button />', () => {
  it('should render button with icon with default iconPosition', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithSSR(<Button icon={CreditCardIcon}>{buttonText}</Button>);
    expect(container).toMatchSnapshot();
  });

  it('should render button as anchor tag', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithSSR(
      <Button href="https://youtu.be/gu3KzCWoons" target="_blank" icon={CreditCardIcon}>
        {buttonText}
      </Button>,
    );
    expect(container).toMatchSnapshot();
  });
});
