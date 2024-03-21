import { fireEvent, waitFor } from '@testing-library/react-native';
import { useState } from 'react';
import { Accordion, AccordionItem, AccordionItemBody, AccordionItemHeader } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { Button } from '~components/Button';

describe('<Accordion />', () => {
  // Accordion uses Collapsible which uses animations and requestAnimationFrame which makes RN tests throw warnings
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render', () => {
    const { toJSON } = renderWithTheme(
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

    expect(toJSON()).toMatchSnapshot();
  });

  it('should expand and close in uncontrolled behavior', async () => {
    // Suppress an act warning that is likely fixed in recent versions https://github.com/callstack/react-native-testing-library/issues/379
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

    const onExpandChange = jest.fn();
    const button1 = 'How can I setup Route?';
    const description1 =
      'You can use Razorpay Route from the Dashboard or using APIs to transfer money to customers. You may also check our docs for detailed instructions.';
    const button2 = 'How can I setup QR Codes?';
    const description2 =
      'Just use Razorpay. You may also check our docs for detailed instructions. Please use the search functionality to ask your queries.';

    const { getByText, getAllByRole } = renderWithTheme(
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

    // Clicking first accordion item
    const trigger1 = getAllByRole('button')[0];
    expect(trigger1).toHaveAccessibilityState({ expanded: false });
    expect(getByText(description1)).not.toBeVisible();

    fireEvent.press(trigger1);
    // wait for animation to finish
    await waitFor(() => expect(getByText(description1)).toBeVisible());

    expect(trigger1).toHaveAccessibilityState({ expanded: true });

    expect(onExpandChange).toHaveBeenCalledTimes(1);
    expect(onExpandChange).toHaveBeenLastCalledWith({ expandedIndex: 0 });

    // Clicking second accordion item
    const trigger2 = getAllByRole('button')[1];
    expect(trigger2).toHaveAccessibilityState({ expanded: false });
    expect(getByText(description2)).not.toBeVisible();

    fireEvent.press(trigger2);
    // wait for animation to finish
    await waitFor(() => expect(getByText(description2)).toBeVisible());

    expect(trigger2).toHaveAccessibilityState({ expanded: true });
    expect(trigger1).toHaveAccessibilityState({ expanded: false });
    expect(getByText(description1)).not.toBeVisible();

    expect(onExpandChange).toHaveBeenCalledTimes(2);
    expect(onExpandChange).toHaveBeenLastCalledWith({ expandedIndex: 1 });

    mockConsoleError.mockRestore();
  });

  it('should expand and close in controlled behavior', async () => {
    // Suppress an act warning that is likely fixed in recent versions https://github.com/callstack/react-native-testing-library/issues/379
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

    const button1 = 'How can I setup Route?';
    const description1 =
      'You can use Razorpay Route from the Dashboard or using APIs to transfer money to customers. You may also check our docs for detailed instructions.';
    const button2 = 'How can I setup QR Codes?';
    const description2 =
      'Just use Razorpay. You may also check our docs for detailed instructions. Please use the search functionality to ask your queries.';

    const ControlledAccordionExample = (): React.ReactElement => {
      const [expandedIndex, setExpandedIndex] = useState(-1);

      return (
        <>
          <Button onClick={() => setExpandedIndex(0)}>Expand First</Button>
          <Button onClick={() => setExpandedIndex(1)}>Expand Second</Button>
          <Button onClick={() => setExpandedIndex(2)}>Expand Third</Button>
          <Button onClick={() => setExpandedIndex(-1)}>Collapse</Button>
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

    const { getByText, getAllByRole } = renderWithTheme(<ControlledAccordionExample />);

    const [, externalButton2, , externalButtonCollapse, trigger1, trigger2] = getAllByRole(
      'button',
    );

    expect(trigger1).toHaveAccessibilityState({ expanded: false });
    expect(getByText(description1)).not.toBeVisible();

    // test first accordion button to toggle first accordion item
    fireEvent.press(trigger1);
    await waitFor(() => expect(getByText(description1)).toBeVisible());

    expect(trigger1).toHaveAccessibilityState({ expanded: true });
    expect(getByText(description1)).toBeVisible();

    // test second external button to toggle second accordion item
    fireEvent.press(externalButton2);
    await waitFor(() => expect(getByText(description2)).toBeVisible());

    expect(trigger2).toHaveAccessibilityState({ expanded: true });

    // first item should be collapsed now
    expect(trigger1).toHaveAccessibilityState({ expanded: false });
    expect(getByText(description1)).not.toBeVisible();
    expect(getByText(description2)).toBeVisible();

    // test collapse external button to collapse all accordion items
    fireEvent.press(externalButtonCollapse);
    await waitFor(() => expect(trigger1).toHaveAccessibilityState({ expanded: false }));

    expect(trigger1).toHaveAccessibilityState({ expanded: false });
    expect(trigger2).toHaveAccessibilityState({ expanded: false });
    expect(getByText(description1)).not.toBeVisible();
    expect(getByText(description2)).not.toBeVisible();

    mockConsoleError.mockRestore();
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
});

describe('Deprecated <Accordion />', () => {
  it('should render', () => {
    const { toJSON } = renderWithTheme(
      <Accordion>
        <AccordionItem
          title="How can I setup Route?"
          description="You can use Razorpay Route from the Dashboard or using APIs to transfer money to customers. You may also check our docs for detailed instructions."
        />
        <AccordionItem
          title="How can I setup QR Codes?"
          description="Just use Razorpay. You may also check our docs for detailed instructions. Please use the search functionality to ask your queries."
        />
        <AccordionItem
          title="How can I setup Subscriptions?"
          description="Just use Razorpay. You may also check our docs for detailed instructions. Please use the search functionality to ask your queries."
        />
      </Accordion>,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render deprecated API', () => {
    const { toJSON } = renderWithTheme(
      <Accordion>
        <AccordionItem
          title="How can I setup Route?"
          description="You can use Razorpay Route from the Dashboard or using APIs to transfer money to customers. You may also check our docs for detailed instructions."
        />
        <AccordionItem
          title="How can I setup QR Codes?"
          description="Just use Razorpay. You may also check our docs for detailed instructions. Please use the search functionality to ask your queries."
        />
        <AccordionItem
          title="How can I setup Subscriptions?"
          description="Just use Razorpay. You may also check our docs for detailed instructions. Please use the search functionality to ask your queries."
        />
      </Accordion>,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should expand and close in uncontrolled behavior', async () => {
    // Suppress an act warning that is likely fixed in recent versions https://github.com/callstack/react-native-testing-library/issues/379
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

    const onExpandChange = jest.fn();
    const button1 = 'How can I setup Route?';
    const description1 =
      'You can use Razorpay Route from the Dashboard or using APIs to transfer money to customers. You may also check our docs for detailed instructions.';
    const button2 = 'How can I setup QR Codes?';
    const description2 =
      'Just use Razorpay. You may also check our docs for detailed instructions. Please use the search functionality to ask your queries.';

    const { getByText, getAllByRole } = renderWithTheme(
      <Accordion onExpandChange={onExpandChange}>
        <AccordionItem title={button1} description={description1} />
        <AccordionItem title={button2} description={description2} />
        <AccordionItem title="How can I setup Subscriptions?" description="Just use Razorpay." />
      </Accordion>,
    );

    // Clicking first accordion item
    const trigger1 = getAllByRole('button')[0];
    expect(trigger1).toHaveAccessibilityState({ expanded: false });
    expect(getByText(description1)).not.toBeVisible();

    fireEvent.press(trigger1);
    // wait for animation to finish
    await waitFor(() => expect(getByText(description1)).toBeVisible());

    expect(trigger1).toHaveAccessibilityState({ expanded: true });

    expect(onExpandChange).toHaveBeenCalledTimes(1);
    expect(onExpandChange).toHaveBeenLastCalledWith({ expandedIndex: 0 });

    // Clicking second accordion item
    const trigger2 = getAllByRole('button')[1];
    expect(trigger2).toHaveAccessibilityState({ expanded: false });
    expect(getByText(description2)).not.toBeVisible();

    fireEvent.press(trigger2);
    // wait for animation to finish
    await waitFor(() => expect(getByText(description2)).toBeVisible());

    expect(trigger2).toHaveAccessibilityState({ expanded: true });
    expect(trigger1).toHaveAccessibilityState({ expanded: false });
    expect(getByText(description1)).not.toBeVisible();

    expect(onExpandChange).toHaveBeenCalledTimes(2);
    expect(onExpandChange).toHaveBeenLastCalledWith({ expandedIndex: 1 });

    mockConsoleError.mockRestore();
  });

  it('should expand and close in controlled behavior', async () => {
    // Suppress an act warning that is likely fixed in recent versions https://github.com/callstack/react-native-testing-library/issues/379
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

    const button1 = 'How can I setup Route?';
    const description1 =
      'You can use Razorpay Route from the Dashboard or using APIs to transfer money to customers. You may also check our docs for detailed instructions.';
    const button2 = 'How can I setup QR Codes?';
    const description2 =
      'Just use Razorpay. You may also check our docs for detailed instructions. Please use the search functionality to ask your queries.';

    const ControlledAccordionExample = (): React.ReactElement => {
      const [expandedIndex, setExpandedIndex] = useState(-1);

      return (
        <>
          <Button onClick={() => setExpandedIndex(0)}>Expand First</Button>
          <Button onClick={() => setExpandedIndex(1)}>Expand Second</Button>
          <Button onClick={() => setExpandedIndex(2)}>Expand Third</Button>
          <Button onClick={() => setExpandedIndex(-1)}>Collapse</Button>
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

    const { getByText, getAllByRole } = renderWithTheme(<ControlledAccordionExample />);

    const [, externalButton2, , externalButtonCollapse, trigger1, trigger2] = getAllByRole(
      'button',
    );

    expect(trigger1).toHaveAccessibilityState({ expanded: false });
    expect(getByText(description1)).not.toBeVisible();

    // test first accordion button to toggle first accordion item
    fireEvent.press(trigger1);
    await waitFor(() => expect(getByText(description1)).toBeVisible());

    expect(trigger1).toHaveAccessibilityState({ expanded: true });
    expect(getByText(description1)).toBeVisible();

    // test second external button to toggle second accordion item
    fireEvent.press(externalButton2);
    await waitFor(() => expect(getByText(description2)).toBeVisible());

    expect(trigger2).toHaveAccessibilityState({ expanded: true });

    // first item should be collapsed now
    expect(trigger1).toHaveAccessibilityState({ expanded: false });
    expect(getByText(description1)).not.toBeVisible();
    expect(getByText(description2)).toBeVisible();

    // test collapse external button to collapse all accordion items
    fireEvent.press(externalButtonCollapse);
    await waitFor(() => expect(trigger1).toHaveAccessibilityState({ expanded: false }));

    expect(trigger1).toHaveAccessibilityState({ expanded: false });
    expect(trigger2).toHaveAccessibilityState({ expanded: false });
    expect(getByText(description1)).not.toBeVisible();
    expect(getByText(description2)).not.toBeVisible();

    mockConsoleError.mockRestore();
  });
});
