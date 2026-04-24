<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Accordion from './Accordion.svelte';

  const { Story } = defineMeta({
    title: 'Components/Accordion',
    component: Accordion,
    tags: ['autodocs'],
    args: {},
    argTypes: {
      variant: {
        control: 'select',
        options: ['transparent', 'filled'],
        description: 'Visual variant of AccordionItem',
        table: { defaultValue: { summary: 'transparent' } },
      },
      size: {
        control: 'select',
        options: ['large', 'medium'],
        description: 'Size of the Accordion',
        table: { defaultValue: { summary: 'large' } },
      },
      showNumberPrefix: {
        control: 'boolean',
        description: 'Adds numeric index at the beginning of items',
        table: { defaultValue: { summary: 'false' } },
      },
    },
  });
</script>

<script lang="ts">
  import AccordionItem from './AccordionItem.svelte';
  import AccordionItemHeader from './AccordionItemHeader.svelte';
  import AccordionItemBody from './AccordionItemBody.svelte';
  import Badge from '../Badge/Badge.svelte';
  import Link from '../Link/Link.svelte';
  import Text from '../Typography/Text/Text.svelte';
  import Heading from '../Typography/Heading/Heading.svelte';
  import Button from '../Button/Button.svelte';
  import { CheckIcon } from '../Icons/CheckIcon';
  import { InfoIcon } from '../Icons/InfoIcon';
  import { SearchIcon } from '../Icons/SearchIcon';
  import { CreditCardIcon } from '../Icons/CreditCardIcon';
  import { PlusIcon } from '../Icons/PlusIcon';
  import { CloseIcon } from '../Icons/CloseIcon';

  let controlledExpandedIndex = $state(-1);
  let customHeaderVisible = $state(true);
</script>

<Story name="Basic Example" asChild>
  <Accordion>
    {#snippet children()}
      <AccordionItem>
        {#snippet children()}
          <AccordionItemHeader title="How can I setup Route?" />
          <AccordionItemBody>
            You can use Razorpay Route from the Dashboard or using APIs to transfer money to
            customers. You may also check our docs for detailed instructions.
          </AccordionItemBody>
        {/snippet}
      </AccordionItem>
      <AccordionItem>
        {#snippet children()}
          <AccordionItemHeader title="How can I setup QR Codes?" />
          <AccordionItemBody>
            Just use Razorpay. You may also check our docs for detailed instructions. Please use the
            search functionality to ask your queries.
          </AccordionItemBody>
        {/snippet}
      </AccordionItem>
      <AccordionItem>
        {#snippet children()}
          <AccordionItemHeader title="How can I setup Subscriptions?" />
          <AccordionItemBody>
            Just use Razorpay. You may also check our docs for detailed instructions. Please use the
            search functionality to ask your queries.
          </AccordionItemBody>
        {/snippet}
      </AccordionItem>
    {/snippet}
  </Accordion>
</Story>

<Story name="With Show Number Prefix" asChild>
  <Accordion showNumberPrefix={true}>
    {#snippet children()}
      <AccordionItem>
        {#snippet children()}
          <AccordionItemHeader title="How can I setup Route?" />
          <AccordionItemBody>
            You can use Razorpay Route from the Dashboard or using APIs to transfer money to
            customers. You may also check our docs for detailed instructions.
          </AccordionItemBody>
        {/snippet}
      </AccordionItem>
      <AccordionItem>
        {#snippet children()}
          <AccordionItemHeader title="How can I setup QR Codes?" />
          <AccordionItemBody>
            Just use Razorpay. You may also check our docs for detailed instructions. Please use the
            search functionality to ask your queries.
          </AccordionItemBody>
        {/snippet}
      </AccordionItem>
      <AccordionItem>
        {#snippet children()}
          <AccordionItemHeader title="How can I setup Subscriptions?" />
          <AccordionItemBody>
            Just use Razorpay. You may also check our docs for detailed instructions. Please use the
            search functionality to ask your queries.
          </AccordionItemBody>
        {/snippet}
      </AccordionItem>
    {/snippet}
  </Accordion>
</Story>

<Story name="With Icons" asChild>
  <Accordion>
    {#snippet children()}
      <AccordionItem>
        {#snippet children()}
          <AccordionItemHeader
            title="How can I setup Route?"
            subtitle="Subtitle of how to setup route"
          >
            {#snippet leading()}
              <CheckIcon size="large" />
            {/snippet}
            {#snippet titleSuffix()}
              <Badge>New</Badge>
            {/snippet}
            {#snippet trailing()}
              <Link
                variant="button"
                onClick={(e) => { e.stopPropagation(); }}
              >
                Apply
              </Link>
            {/snippet}
          </AccordionItemHeader>
          <AccordionItemBody>
            You can use Razorpay Route from the Dashboard or using APIs to transfer money to
            customers. You may also check our docs for detailed instructions.
          </AccordionItemBody>
        {/snippet}
      </AccordionItem>
      <AccordionItem>
        {#snippet children()}
          <AccordionItemHeader title="How can I setup QR Codes?">
            {#snippet leading()}
              <InfoIcon size="large" />
            {/snippet}
          </AccordionItemHeader>
          <AccordionItemBody>
            Just use Razorpay. You may also check our docs for detailed instructions. Please use the
            search functionality to ask your queries.
          </AccordionItemBody>
        {/snippet}
      </AccordionItem>
      <AccordionItem>
        {#snippet children()}
          <AccordionItemHeader title="How can I setup Subscriptions?">
            {#snippet leading()}
              <CreditCardIcon size="large" />
            {/snippet}
          </AccordionItemHeader>
          <AccordionItemBody>
            Just use Razorpay. You may also check our docs for detailed instructions. Please use the
            search functionality to ask your queries.
          </AccordionItemBody>
        {/snippet}
      </AccordionItem>
    {/snippet}
  </Accordion>
</Story>

<Story name="Controlled Example" asChild>
  <div>
    <div style="display: flex; flex-direction: row; gap: 16px; margin-bottom: 24px; flex-wrap: wrap;">
      <Button onClick={() => { controlledExpandedIndex = 0; }}>Expand First</Button>
      <Button onClick={() => { controlledExpandedIndex = 1; }}>Expand Second</Button>
      <Button onClick={() => { controlledExpandedIndex = 2; }}>Expand Third</Button>
      <Button onClick={() => { controlledExpandedIndex = -1; }}>Collapse</Button>
    </div>
    <Accordion
      showNumberPrefix={true}
      expandedIndex={controlledExpandedIndex}
      onExpandChange={({ expandedIndex }) => { controlledExpandedIndex = expandedIndex; }}
    >
      {#snippet children()}
        <AccordionItem>
          {#snippet children()}
            <AccordionItemHeader title="How can I setup Route?" />
            <AccordionItemBody>
              You can use Razorpay Route from the Dashboard or using APIs to transfer money to
              customers. You may also check our docs for detailed instructions.
            </AccordionItemBody>
          {/snippet}
        </AccordionItem>
        <AccordionItem>
          {#snippet children()}
            <AccordionItemHeader title="How can I setup QR Codes?" />
            <AccordionItemBody>
              Just use Razorpay. You may also check our docs for detailed instructions. Please use the
              search functionality to ask your queries.
            </AccordionItemBody>
          {/snippet}
        </AccordionItem>
        <AccordionItem>
          {#snippet children()}
            <AccordionItemHeader title="How can I setup Subscriptions?" />
            <AccordionItemBody>
              Just use Razorpay. You may also check our docs for detailed instructions. Please use the
              search functionality to ask your queries.
            </AccordionItemBody>
          {/snippet}
        </AccordionItem>
      {/snippet}
    </Accordion>
  </div>
</Story>

<Story name="Custom Header Body" asChild>
  <Accordion>
    {#snippet children()}
      <AccordionItem>
        {#snippet children()}
          <AccordionItemHeader title="How can I setup Route?" />
          <AccordionItemBody>
            {#snippet children()}
              <Text color="surface.text.gray.subtle">
                You can use Razorpay Route from the Dashboard or using APIs to transfer money to
                customers. You may also check our docs for detailed instructions.
              </Text>
              {#if customHeaderVisible}
                <div style="padding: 12px; background: var(--feedback-background-information-subtle); border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <Text weight="semibold">Custom slot</Text>
                    <Text size="small" color="surface.text.gray.subtle">You can render anything here along with description</Text>
                  </div>
                  <button
                    style="border: none; background: none; cursor: pointer; padding: 4px;"
                    onclick={() => { customHeaderVisible = false; }}
                  >
                    <CloseIcon size="medium" />
                  </button>
                </div>
              {/if}
            {/snippet}
          </AccordionItemBody>
        {/snippet}
      </AccordionItem>
      <AccordionItem>
        {#snippet children()}
          <AccordionItemHeader>
            {#snippet children()}
              <Text color="surface.text.primary.normal">CUSTOM SLOT HEADER</Text>
            {/snippet}
          </AccordionItemHeader>
          <AccordionItemBody>
            {#snippet children()}
              <div style="padding: 12px; background: var(--feedback-background-information-subtle); border-radius: 4px;">
                <Text weight="semibold">Custom Slot Body</Text>
                <Text size="small" color="surface.text.gray.subtle">Or you can skip description altogether and just render a custom component here</Text>
              </div>
            {/snippet}
          </AccordionItemBody>
        {/snippet}
      </AccordionItem>
      <AccordionItem>
        {#snippet children()}
          <AccordionItemHeader title="How can I setup Subscriptions?" />
          <AccordionItemBody>
            Just use Razorpay. You may also check our docs for detailed instructions. Please use the
            search functionality to ask your queries.
          </AccordionItemBody>
        {/snippet}
      </AccordionItem>
    {/snippet}
  </Accordion>
</Story>

<Story name="Multiple Accordion Composition" asChild>
  <div style="max-width: 480px;">
    <Accordion variant="filled">
      {#snippet children()}
        <AccordionItem>
          {#snippet children()}
            <AccordionItemHeader title="PhonePe Wallet" subtitle="+ ₹50 Extra Charge" />
            <AccordionItemBody>
              {#snippet children()}
                <div style="display: flex; flex-direction: column; gap: 12px;">
                  <input type="tel" placeholder="Enter Phone Number" style="padding: 8px 12px; border: 1px solid var(--surface-border-gray-subtle); border-radius: 4px; font-size: 14px;" />
                  <Button>Continue</Button>
                </div>
              {/snippet}
            </AccordionItemBody>
          {/snippet}
        </AccordionItem>
      {/snippet}
    </Accordion>
    <div style="margin-top: 20px;">
      <Accordion variant="filled">
        {#snippet children()}
          <AccordionItem>
            {#snippet children()}
              <AccordionItemHeader
                title="HDFC Credit Card"
                subtitle="No EMI Cost Available"
              >
                {#snippet titleSuffix()}
                  <Badge color="positive">Upto ₹500 off</Badge>
                {/snippet}
              </AccordionItemHeader>
              <AccordionItemBody>
                {#snippet children()}
                  <div style="display: flex; flex-direction: column; gap: 12px;">
                    <input type="number" placeholder="Enter Card Number" style="padding: 8px 12px; border: 1px solid var(--surface-border-gray-subtle); border-radius: 4px; font-size: 14px;" />
                    <Button>Continue</Button>
                  </div>
                {/snippet}
              </AccordionItemBody>
            {/snippet}
          </AccordionItem>
        {/snippet}
      </Accordion>
    </div>
    <div style="margin-top: 20px;">
      <Accordion variant="filled">
        {#snippet children()}
          <AccordionItem>
            {#snippet children()}
              <AccordionItemHeader title="Google Pay">
                {#snippet titleSuffix()}
                  <Badge color="positive">5% Cashback</Badge>
                {/snippet}
              </AccordionItemHeader>
              <AccordionItemBody>
                {#snippet children()}
                  <div style="display: flex; flex-direction: column; gap: 12px;">
                    <input type="text" placeholder="xyz@okhdfcbank" style="padding: 8px 12px; border: 1px solid var(--surface-border-gray-subtle); border-radius: 4px; font-size: 14px; width: 100%;" />
                    <Button isFullWidth>Continue</Button>
                  </div>
                {/snippet}
              </AccordionItemBody>
            {/snippet}
          </AccordionItem>
        {/snippet}
      </Accordion>
    </div>
  </div>
</Story>

<Story name="Individual Accordion Item" asChild>
  <div style="max-width: 480px;">
    <Accordion variant="filled">
      {#snippet children()}
        <AccordionItem>
          {#snippet children()}
            <AccordionItemHeader>
              {#snippet children()}
                <Text size="medium" color="surface.text.gray.muted">#8218851</Text>
                <div style="margin: 4px 0;">
                  <Text size="large" weight="semibold">Transactions and settlement related</Text>
                </div>
                <div style="display: flex; flex-direction: row; gap: 12px; align-items: center;">
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--feedback-background-information-intense); display: inline-block;"></span>
                    <Text size="medium" color="feedback.text.information.intense">In Progress</Text>
                  </div>
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <InfoIcon size="medium" color="surface.icon.gray.subtle" />
                    <Text size="medium" color="surface.text.gray.subtle">Merchant Risk</Text>
                  </div>
                </div>
              {/snippet}
            </AccordionItemHeader>
            <AccordionItemBody>
              {#snippet children()}
                <Text color="surface.text.gray.subtle">
                  Razorpay please verify a payment of ₹5,000 done by me to Razer for
                  reloading gold as it seems they haven't received it. Payment Id: pay_LlI3slkdirf234
                </Text>
              {/snippet}
            </AccordionItemBody>
          {/snippet}
        </AccordionItem>
      {/snippet}
    </Accordion>
  </div>
</Story>

<Story name="Accordion Item Header Variants" asChild>
  <div>
    <Heading size="xlarge">Accordion Header Types</Heading>
    <div style="margin-top: 16px;">
      <Accordion variant="filled">
        {#snippet children()}
          <AccordionItem>
            {#snippet children()}
              <AccordionItemHeader title="Simple Title & Text Item" />
              <AccordionItemBody>
                Just use Razorpay. You may also check our docs for detailed instructions. Please use the
                search functionality to ask your queries.
              </AccordionItemBody>
            {/snippet}
          </AccordionItem>
          <AccordionItem>
            {#snippet children()}
              <AccordionItemHeader title="Title Text of Accordion" subtitle="Subtitle Text" />
              <AccordionItemBody>
                Just use Razorpay. You may also check our docs for detailed instructions. Please use the
                search functionality to ask your queries.
              </AccordionItemBody>
            {/snippet}
          </AccordionItem>
          <AccordionItem>
            {#snippet children()}
              <AccordionItemHeader title="Item with Icon and subtitle" subtitle="Subtitle Text">
                {#snippet leading()}
                  <InfoIcon size="large" />
                {/snippet}
              </AccordionItemHeader>
              <AccordionItemBody>
                Just use Razorpay. You may also check our docs for detailed instructions. Please use the
                search functionality to ask your queries.
              </AccordionItemBody>
            {/snippet}
          </AccordionItem>
          <AccordionItem>
            {#snippet children()}
              <AccordionItemHeader title="Item with Trailing" subtitle="Subtitle Text">
                {#snippet leading()}
                  <InfoIcon size="large" />
                {/snippet}
                {#snippet trailing()}
                  <Link variant="button" onClick={(e) => { e.stopPropagation(); }}>Apply</Link>
                {/snippet}
              </AccordionItemHeader>
              <AccordionItemBody>
                Just use Razorpay. You may also check our docs for detailed instructions. Please use the
                search functionality to ask your queries.
              </AccordionItemBody>
            {/snippet}
          </AccordionItem>
          <AccordionItem>
            {#snippet children()}
              <AccordionItemHeader title="Item with Badge">
                {#snippet leading()}
                  <InfoIcon size="large" />
                {/snippet}
                {#snippet titleSuffix()}
                  <Badge>New</Badge>
                {/snippet}
              </AccordionItemHeader>
              <AccordionItemBody>
                Just use Razorpay. You may also check our docs for detailed instructions. Please use the
                search functionality to ask your queries.
              </AccordionItemBody>
            {/snippet}
          </AccordionItem>
          <AccordionItem>
            {#snippet children()}
              <AccordionItemHeader title="Item without subtitle">
                {#snippet leading()}
                  <PlusIcon size="large" />
                {/snippet}
              </AccordionItemHeader>
              <AccordionItemBody>
                Just use Razorpay. You may also check our docs for detailed instructions. Please use the
                search functionality to ask your queries.
              </AccordionItemBody>
            {/snippet}
          </AccordionItem>
          <AccordionItem>
            {#snippet children()}
              <AccordionItemHeader title="Slot item with subtitle" subtitle="Subtitle Text">
                {#snippet leading()}
                  <img
                    src="https://picsum.photos/200/300"
                    height="20"
                    width="20"
                    style="border-radius: 4px;"
                    alt="Random placeholder"
                  />
                {/snippet}
              </AccordionItemHeader>
              <AccordionItemBody>
                Just use Razorpay. You may also check our docs for detailed instructions. Please use the
                search functionality to ask your queries.
              </AccordionItemBody>
            {/snippet}
          </AccordionItem>
          <AccordionItem>
            {#snippet children()}
              <AccordionItemHeader title="Slot item without subtitle">
                {#snippet leading()}
                  <img
                    src="https://picsum.photos/200/300"
                    height="20"
                    width="20"
                    style="border-radius: 4px;"
                    alt="Random placeholder"
                  />
                {/snippet}
              </AccordionItemHeader>
              <AccordionItemBody>
                Just use Razorpay. You may also check our docs for detailed instructions. Please use the
                search functionality to ask your queries.
              </AccordionItemBody>
            {/snippet}
          </AccordionItem>
          <AccordionItem>
            {#snippet children()}
              <AccordionItemHeader>
                {#snippet children()}
                  <div>
                    <Text>Custom Slot Header</Text>
                  </div>
                {/snippet}
              </AccordionItemHeader>
              <AccordionItemBody>
                {#snippet children()}
                  <div>
                    <Text>Custom Slot BODY</Text>
                  </div>
                {/snippet}
              </AccordionItemBody>
            {/snippet}
          </AccordionItem>
          <AccordionItem isDisabled={true}>
            {#snippet children()}
              <AccordionItemHeader title="Item with Badge" subtitle="Subtitle Text">
                {#snippet leading()}
                  <InfoIcon size="large" color="surface.icon.gray.disabled" />
                {/snippet}
                {#snippet titleSuffix()}
                  <Badge>New</Badge>
                {/snippet}
              </AccordionItemHeader>
              <AccordionItemBody>
                Just use Razorpay. You may also check our docs for detailed instructions. Please use the
                search functionality to ask your queries.
              </AccordionItemBody>
            {/snippet}
          </AccordionItem>
        {/snippet}
      </Accordion>
    </div>
  </div>
</Story>

<Story name="Accordion Deprecated API" asChild>
  <Accordion variant="transparent" size="large">
    {#snippet children()}
      <AccordionItem>
        {#snippet children()}
          <AccordionItemHeader title="How can I setup Subscriptions?">
            {#snippet leading()}
              <CheckIcon size="large" color="surface.icon.gray.normal" />
            {/snippet}
          </AccordionItemHeader>
          <AccordionItemBody>
            Just use Razorpay. You may also check our docs for detailed instructions. Please use the
            search functionality to ask your queries.
          </AccordionItemBody>
        {/snippet}
      </AccordionItem>
      <AccordionItem>
        {#snippet children()}
          <AccordionItemHeader title="How can I setup QR Codes?">
            {#snippet leading()}
              <InfoIcon size="large" color="surface.icon.gray.normal" />
            {/snippet}
          </AccordionItemHeader>
          <AccordionItemBody>
            Just use Razorpay. You may also check our docs for detailed instructions. Please use the
            search functionality to ask your queries.
          </AccordionItemBody>
        {/snippet}
      </AccordionItem>
      <AccordionItem>
        {#snippet children()}
          <AccordionItemHeader title="How can I setup Routes?">
            {#snippet leading()}
              <SearchIcon size="large" color="surface.icon.gray.normal" />
            {/snippet}
          </AccordionItemHeader>
          <AccordionItemBody>
            {#snippet children()}
              <div>
                <Text>Deprecated slot</Text>
                <Text>Deprecated slot</Text>
              </div>
            {/snippet}
          </AccordionItemBody>
        {/snippet}
      </AccordionItem>
    {/snippet}
  </Accordion>
</Story>
