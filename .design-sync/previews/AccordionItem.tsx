import React from 'react';
import { Accordion, AccordionItem, AccordionItemHeader, AccordionItemBody } from '@razorpay/blade/components';

export const Default = () => (
  <Accordion>
    <AccordionItem>
      <AccordionItemHeader title="Account Setup" />
      <AccordionItemBody>
        You can setup your account from the Dashboard or using APIs. Check our docs for detailed instructions.
      </AccordionItemBody>
    </AccordionItem>
  </Accordion>
);

export const WithMultipleItems = () => (
  <Accordion>
    <AccordionItem>
      <AccordionItemHeader title="How can I setup Route?" />
      <AccordionItemBody>
        You can use Razorpay Route from the Dashboard or using APIs to transfer money to customers.
        You may also check our docs for detailed instructions.
      </AccordionItemBody>
    </AccordionItem>
    <AccordionItem>
      <AccordionItemHeader title="How can I setup QR Codes?" />
      <AccordionItemBody>
        Just use Razorpay. You may also check our docs for detailed instructions.
        Please use the search functionality to ask your queries.
      </AccordionItemBody>
    </AccordionItem>
  </Accordion>
);

export const DefaultExpanded = () => (
  <Accordion defaultExpandedIndex={0}>
    <AccordionItem>
      <AccordionItemHeader title="Payment Methods" />
      <AccordionItemBody>
        We support Credit Cards, Debit Cards, UPI, Net Banking, and Wallets for seamless payment processing.
      </AccordionItemBody>
    </AccordionItem>
    <AccordionItem>
      <AccordionItemHeader title="Settlement Timeline" />
      <AccordionItemBody>
        Settlements are typically processed within 2-3 business days after the transaction is completed.
      </AccordionItemBody>
    </AccordionItem>
  </Accordion>
);
