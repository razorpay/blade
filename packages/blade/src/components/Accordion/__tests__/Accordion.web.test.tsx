import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { waitFor } from '@testing-library/react';
import { Accordion, AccordionItem, AccordionItemBody, AccordionItemHeader } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';
import { Button } from '~components/Button';

describe('<Accordion />', () => {
  it('should render', () => {
    const { container } = renderWithTheme(
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
        <AccordionItem>
          <AccordionItemHeader title="How can I setup Subscriptions?" />
          <AccordionItemBody>
            Just use Razorpay. You may also check our docs for detailed instructions. Please use the
            search functionality to ask your queries.
          </AccordionItemBody>
        </AccordionItem>
      </Accordion>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should expand and close in uncontrolled behavior', async () => {
    const onExpandChange = jest.fn();
    const button1 = 'How can I setup Route?';
    const description1 =
      'You can use Razorpay Route from the Dashboard or using APIs to transfer money to customers. You may also check our docs for detailed instructions.';
    const button2 = 'How can I setup QR Codes?';
    const description2 =
      'Just use Razorpay. You may also check our docs for detailed instructions. Please use the search functionality to ask your queries.';

    const { getByRole, getByText, getAllByRole } = renderWithTheme(
      <Accordion onExpandChange={onExpandChange}>
        <AccordionItem>
          <AccordionItemHeader title={button1} />
          <AccordionItemBody>{description1}</AccordionItemBody>
        </AccordionItem>
        <AccordionItem>
          <AccordionItemHeader title={button2} />
          <AccordionItemBody>{description2}</AccordionItemBody>
        </AccordionItem>
        <AccordionItem>
          <AccordionItemHeader title="How can I setup Subscriptions?" />
          <AccordionItemBody>Just use Razorpay.</AccordionItemBody>
        </AccordionItem>
      </Accordion>,
    );

    const user = userEvent.setup();

    // Clicking first accordion item
    const trigger1 = getByRole('button', { name: button1 });
    expect(trigger1).toHaveAttribute('aria-expanded', 'false');
    expect(getByText(description1)).not.toBeVisible();
    expect(getAllByRole('region', { hidden: true })[0]).toHaveAttribute('aria-hidden', 'true');

    await user.click(trigger1);
    // wait for animation to finish
    await waitFor(() => expect(getByText(description1)).toBeVisible());

    expect(trigger1).toHaveAttribute('aria-expanded', 'true');
    expect(getAllByRole('region')[0]).toHaveAttribute('aria-hidden', 'false');

    expect(onExpandChange).toHaveBeenCalledTimes(1);
    expect(onExpandChange).toHaveBeenLastCalledWith({ expandedIndex: 0 });

    // Clicking second accordion item
    const trigger2 = getByRole('button', { name: button2 });
    expect(trigger2).toHaveAttribute('aria-expanded', 'false');
    expect(getByText(description2)).not.toBeVisible();
    expect(getAllByRole('region', { hidden: true })[1]).toHaveAttribute('aria-hidden', 'true');

    await user.click(trigger2);
    // wait for animation to finish
    await waitFor(() => expect(getByText(description2)).toBeVisible());

    expect(trigger2).toHaveAttribute('aria-expanded', 'true');
    expect(trigger1).toHaveAttribute('aria-expanded', 'false');
    expect(getAllByRole('region', { hidden: true })[1]).toHaveAttribute('aria-hidden', 'false');
    expect(getAllByRole('region', { hidden: true })[0]).toHaveAttribute('aria-hidden', 'true');

    expect(onExpandChange).toHaveBeenCalledTimes(2);
    expect(onExpandChange).toHaveBeenLastCalledWith({ expandedIndex: 1 });
  });

  it('should expand and close in controlled behavior', async () => {
    const button1 = 'How can I setup Route?';
    const description1 =
      'You can use Razorpay Route from the Dashboard or using APIs to transfer money to customers. You may also check our docs for detailed instructions.';
    const button2 = 'How can I setup QR Codes?';
    const description2 =
      'Just use Razorpay. You may also check our docs for detailed instructions. Please use the search functionality to ask your queries.';
    const externalButton1 = 'Expand First';
    const externalButton2 = 'Expand Second';
    const externalButtonCollapse = 'Collapse';

    const ControlledAccordionExample = (): React.ReactElement => {
      const [expandedIndex, setExpandedIndex] = useState(-1);

      return (
        <>
          <Button onClick={() => setExpandedIndex(0)}>{externalButton1}</Button>
          <Button onClick={() => setExpandedIndex(1)}>{externalButton2}</Button>
          <Button onClick={() => setExpandedIndex(2)}>Expand Third</Button>
          <Button onClick={() => setExpandedIndex(-1)}>{externalButtonCollapse}</Button>
          <Accordion
            variant="filled"
            expandedIndex={expandedIndex}
            onExpandChange={({ expandedIndex }) => setExpandedIndex(expandedIndex)}
          >
            <AccordionItem>
              <AccordionItemHeader title={button1} />
              <AccordionItemBody>{description1}</AccordionItemBody>
            </AccordionItem>
            <AccordionItem>
              <AccordionItemHeader title={button2} />
              <AccordionItemBody>{description2}</AccordionItemBody>
            </AccordionItem>
            <AccordionItem>
              <AccordionItemHeader title="How can I setup Subscriptions?" />
              <AccordionItemBody>Just use Razorpay.</AccordionItemBody>
            </AccordionItem>
          </Accordion>
          ,
        </>
      );
    };

    const { getByRole, getByText, getAllByRole } = renderWithTheme(<ControlledAccordionExample />);

    const user = userEvent.setup();

    const trigger1 = getByRole('button', { name: button1 });
    expect(trigger1).toHaveAttribute('aria-expanded', 'false');
    expect(getByText(description1)).not.toBeVisible();
    expect(getAllByRole('region', { hidden: true })[0]).toHaveAttribute('aria-hidden', 'true');

    // test first accordion button to toggle first accordion item
    await user.click(trigger1);
    await waitFor(() => expect(getByText(description1)).toBeVisible());

    expect(trigger1).toHaveAttribute('aria-expanded', 'true');
    expect(getByText(description1)).toBeVisible();
    expect(getAllByRole('region', { hidden: true })[0]).toHaveAttribute('aria-hidden', 'false');

    // test second external button to toggle second accordion item
    await user.click(getByRole('button', { name: externalButton2 }));
    await waitFor(() => expect(getByText(description2)).toBeVisible());

    expect(getByRole('button', { name: button2 })).toHaveAttribute('aria-expanded', 'true');
    expect(getAllByRole('region', { hidden: true })[1]).toHaveAttribute('aria-hidden', 'false');

    // first item should be collapsed now
    expect(getAllByRole('region', { hidden: true })[0]).toHaveAttribute('aria-hidden', 'true');

    // test collapse external button to collapse all accordion items
    await user.click(getByRole('button', { name: externalButtonCollapse }));
    await waitFor(() => expect(trigger1).toHaveAttribute('aria-expanded', 'false'));

    expect(getAllByRole('region', { hidden: true })[0]).toHaveAttribute('aria-hidden', 'true');

    expect(getByRole('button', { name: button2 })).toHaveAttribute('aria-expanded', 'false');
    expect(getAllByRole('region', { hidden: true })[1]).toHaveAttribute('aria-hidden', 'true');
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <Accordion testID="accordion">
        <AccordionItem
          title="How can I setup Route?"
          description="You can use Razorpay Route from the Dashboard or using APIs to transfer money to customers. You may also check our docs for detailed instructions."
          testID="accordion-item-1"
        />
        <AccordionItem
          title="How can I setup QR Codes?"
          description="Just use Razorpay. You may also check our docs for detailed instructions. Please use the search functionality to ask your queries."
          testID="accordion-item-2"
        />
        <AccordionItem title="How can I setup Subscriptions?" description="Just use Razorpay." />
      </Accordion>,
    );

    getByTestId('accordion');
    getByTestId('accordion-item-1');
    getByTestId('accordion-item-2');
  });

  it('should pass general a11y', async () => {
    const { container } = renderWithTheme(
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

    await assertAccessible(container);
  });
});

describe('Deprecated <Accordion />', () => {
  it('should render', () => {
    const { container } = renderWithTheme(
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

  it('should expand and close in uncontrolled behavior', async () => {
    const onExpandChange = jest.fn();
    const button1 = 'How can I setup Route?';
    const description1 =
      'You can use Razorpay Route from the Dashboard or using APIs to transfer money to customers. You may also check our docs for detailed instructions.';
    const button2 = 'How can I setup QR Codes?';
    const description2 =
      'Just use Razorpay. You may also check our docs for detailed instructions. Please use the search functionality to ask your queries.';

    const { getByRole, getByText, getAllByRole } = renderWithTheme(
      <Accordion onExpandChange={onExpandChange}>
        <AccordionItem title={button1} description={description1} />
        <AccordionItem title={button2} description={description2} />
        <AccordionItem title="How can I setup Subscriptions?" description="Just use Razorpay." />
      </Accordion>,
    );

    const user = userEvent.setup();

    // Clicking first accordion item
    const trigger1 = getByRole('button', { name: button1 });
    expect(trigger1).toHaveAttribute('aria-expanded', 'false');
    expect(getByText(description1)).not.toBeVisible();
    expect(getAllByRole('region', { hidden: true })[0]).toHaveAttribute('aria-hidden', 'true');

    await user.click(trigger1);
    // wait for animation to finish
    await waitFor(() => expect(getByText(description1)).toBeVisible());

    expect(trigger1).toHaveAttribute('aria-expanded', 'true');
    expect(getAllByRole('region')[0]).toHaveAttribute('aria-hidden', 'false');

    expect(onExpandChange).toHaveBeenCalledTimes(1);
    expect(onExpandChange).toHaveBeenLastCalledWith({ expandedIndex: 0 });

    // Clicking second accordion item
    const trigger2 = getByRole('button', { name: button2 });
    expect(trigger2).toHaveAttribute('aria-expanded', 'false');
    expect(getByText(description2)).not.toBeVisible();
    expect(getAllByRole('region', { hidden: true })[1]).toHaveAttribute('aria-hidden', 'true');

    await user.click(trigger2);
    // wait for animation to finish
    await waitFor(() => expect(getByText(description2)).toBeVisible());

    expect(trigger2).toHaveAttribute('aria-expanded', 'true');
    expect(trigger1).toHaveAttribute('aria-expanded', 'false');
    expect(getAllByRole('region', { hidden: true })[1]).toHaveAttribute('aria-hidden', 'false');
    expect(getAllByRole('region', { hidden: true })[0]).toHaveAttribute('aria-hidden', 'true');

    expect(onExpandChange).toHaveBeenCalledTimes(2);
    expect(onExpandChange).toHaveBeenLastCalledWith({ expandedIndex: 1 });
  });

  it('should expand and close in controlled behavior', async () => {
    const button1 = 'How can I setup Route?';
    const description1 =
      'You can use Razorpay Route from the Dashboard or using APIs to transfer money to customers. You may also check our docs for detailed instructions.';
    const button2 = 'How can I setup QR Codes?';
    const description2 =
      'Just use Razorpay. You may also check our docs for detailed instructions. Please use the search functionality to ask your queries.';
    const externalButton1 = 'Expand First';
    const externalButton2 = 'Expand Second';
    const externalButtonCollapse = 'Collapse';

    const ControlledAccordionExample = (): React.ReactElement => {
      const [expandedIndex, setExpandedIndex] = useState(-1);

      return (
        <>
          <Button onClick={() => setExpandedIndex(0)}>{externalButton1}</Button>
          <Button onClick={() => setExpandedIndex(1)}>{externalButton2}</Button>
          <Button onClick={() => setExpandedIndex(2)}>Expand Third</Button>
          <Button onClick={() => setExpandedIndex(-1)}>{externalButtonCollapse}</Button>
          <Accordion
            expandedIndex={expandedIndex}
            onExpandChange={({ expandedIndex }) => setExpandedIndex(expandedIndex)}
          >
            <AccordionItem title={button1} description={description1} />
            <AccordionItem title={button2} description={description2} />
            <AccordionItem
              title="How can I setup Subscriptions?"
              description="Just use Razorpay."
            />
          </Accordion>
          ,
        </>
      );
    };

    const { getByRole, getByText, getAllByRole } = renderWithTheme(<ControlledAccordionExample />);

    const user = userEvent.setup();

    const trigger1 = getByRole('button', { name: button1 });
    expect(trigger1).toHaveAttribute('aria-expanded', 'false');
    expect(getByText(description1)).not.toBeVisible();
    expect(getAllByRole('region', { hidden: true })[0]).toHaveAttribute('aria-hidden', 'true');

    // test first accordion button to toggle first accordion item
    await user.click(trigger1);
    await waitFor(() => expect(getByText(description1)).toBeVisible());

    expect(trigger1).toHaveAttribute('aria-expanded', 'true');
    expect(getByText(description1)).toBeVisible();
    expect(getAllByRole('region', { hidden: true })[0]).toHaveAttribute('aria-hidden', 'false');

    // test second external button to toggle second accordion item
    await user.click(getByRole('button', { name: externalButton2 }));
    await waitFor(() => expect(getByText(description2)).toBeVisible());

    expect(getByRole('button', { name: button2 })).toHaveAttribute('aria-expanded', 'true');
    expect(getAllByRole('region', { hidden: true })[1]).toHaveAttribute('aria-hidden', 'false');

    // first item should be collapsed now
    expect(getAllByRole('region', { hidden: true })[0]).toHaveAttribute('aria-hidden', 'true');

    // test collapse external button to collapse all accordion items
    await user.click(getByRole('button', { name: externalButtonCollapse }));
    await waitFor(() => expect(trigger1).toHaveAttribute('aria-expanded', 'false'));

    expect(getAllByRole('region', { hidden: true })[0]).toHaveAttribute('aria-hidden', 'true');

    expect(getByRole('button', { name: button2 })).toHaveAttribute('aria-expanded', 'false');
    expect(getAllByRole('region', { hidden: true })[1]).toHaveAttribute('aria-hidden', 'true');
  });
  it('should render data attributes with correct values', () => {
    const { container } = renderWithTheme(
      <Accordion data-analytics-accordion-name="razorpay-faq">
        <AccordionItem data-analytics-accordion-item="first">
          <AccordionItemHeader
            data-analytics-accordion-header="setup route query"
            title="How can I setup Route?"
          />
          <AccordionItemBody data-analytics-item-body="router query answer">
            You can use Razorpay Route from the Dashboard or using APIs to transfer money to
            customers. You may also check our docs for detailed instructions.
          </AccordionItemBody>
        </AccordionItem>
      </Accordion>,
    );

    // Check presence and values of data attributes
    expect(container.querySelector('[data-analytics-accordion-header]')).toHaveAttribute(
      'data-analytics-accordion-header',
      'setup route query',
    );
    expect(container.querySelector('[data-analytics-item-body]')).toHaveAttribute(
      'data-analytics-item-body',
      'router query answer',
    );
    expect(container.querySelector('[data-analytics-accordion-item]')).toHaveAttribute(
      'data-analytics-accordion-item',
      'first',
    );
    expect(container.querySelector('[data-analytics-accordion-name]')).toHaveAttribute(
      'data-analytics-accordion-name',
      'razorpay-faq',
    );
  });
});
