/* eslint-disable @typescript-eslint/no-empty-function */
import renderWithSSR from '~src/_helpers/testing/renderWithSSR.web';
import { Accordion } from '../Accordion';
import { AccordionItem } from '../AccordionItem';

describe('<Accordion />', () => {
  it('should render Accordion on server', () => {
    const { container } = renderWithSSR(
      <Accordion>
        <AccordionItem
          title="How can I setup Route?"
          description="You can use Razorpay Route from the Dashboard or using APIs to transfer money to customers. You may also check our docs for detailed instructions."
        />
        <AccordionItem
          title="How can I setup QR Codes?"
          description="Just use Razorpay. You may also check our docs for detailed instructions. Please use the search functionality to ask your queries."
        />
        <AccordionItem title="How can I setup Subscriptions?" description="Just use Razorpay." />
      </Accordion>,
    );

    expect(container).toMatchSnapshot();
  });
});
