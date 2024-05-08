/* eslint-disable @typescript-eslint/no-empty-function */
import { Accordion, AccordionItem, AccordionItemBody, AccordionItemHeader } from '../index';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<Accordion />', () => {
  it('should render Accordion on server', () => {
    const { container } = renderWithSSR(
      <Accordion>
        <AccordionItem>
          <AccordionItemHeader title="How can I setup Route?" />
          <AccordionItemBody>
            You can use Razorpay Route from the Dashboard or using APIs to transfer money to
            customers. You may also check our docs for detailed instructions.
          </AccordionItemBody>
        </AccordionItem>
        <AccordionItem>
          <AccordionItemHeader title="How can I setup QR Codes?" />
          <AccordionItemBody>
            Just use Razorpay. You may also check our docs for detailed instructions. Please use the
            search functionality to ask your queries.
          </AccordionItemBody>
        </AccordionItem>
      </Accordion>,
    );

    expect(container).toMatchSnapshot();
  });

  // Skipped because `useId` is rendering different internal ids for `aria-controls`
  // GitHub issue- https://github.com/razorpay/blade/issues/2072
  it.skip('should render Deprecated API of Accordion on server', () => {
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
