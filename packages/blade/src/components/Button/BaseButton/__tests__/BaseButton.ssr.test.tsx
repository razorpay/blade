import BaseButton from '../BaseButton';
import renderWithSSR from '~utils/testing/renderWithSSR.web';
import { CreditCardIcon } from '~components/Icons';

describe('<BaseButton />', () => {
  it('should render button with icon with left iconPosition', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithSSR(
      <BaseButton iconPosition="left" icon={CreditCardIcon}>
        {buttonText}
      </BaseButton>,
    );
    expect(container).toMatchSnapshot();
  });
});
