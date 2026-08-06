<script lang="ts">
  import type {
    AppBarLeadingSlot,
    ButtonSlot,
    CardSlot,
    StyleOverride,
  } from '@razorpay/blade-core/styles';
  import AppBar from '../AppBar/AppBar.svelte';
  import AppBarLeading from '../AppBar/AppBarLeading.svelte';
  import AppBarActions from '../AppBar/AppBarActions.svelte';
  import IconButton from '../Button/IconButton/IconButton.svelte';
  import Avatar from '../Avatar/Avatar.svelte';
  import Heading from '../Typography/Heading/Heading.svelte';
  import Text from '../Typography/Text/Text.svelte';
  import Badge from '../Badge/Badge.svelte';
  import Card from '../Card/Card.svelte';
  import CardBody from '../Card/CardBody.svelte';
  import Button from '../Button/Button.svelte';
  import Amount from '../Amount/Amount.svelte';
  import Link from '../Link/Link.svelte';
  import AnnouncementBanner from '../AnnouncementBanner/AnnouncementBanner.svelte';
  import Accordion from '../Accordion/Accordion.svelte';
  import AccordionItem from '../Accordion/AccordionItem.svelte';
  import AccordionItemHeader from '../Accordion/AccordionItemHeader.svelte';
  import AccordionItemBody from '../Accordion/AccordionItemBody.svelte';
  import Divider from '../Divider/Divider.svelte';
  import CheckoutMethodIcon from './CheckoutMethodIcon.svelte';
  import { ChevronRightIcon, InfoIcon, MoreFilledIcon, UserIcon } from '../Icons';

  const noop = (): void => undefined;

  const upiApps: Array<{
    name: string;
    logo: string;
    offer?: string;
    isMore?: boolean;
  }> = [
    { name: 'Google Pay', logo: 'https://cdn.razorpay.com/app/googlepay.svg' },
    { name: 'PhonePe', logo: 'https://cdn.razorpay.com/app/phonepe.svg' },
    { name: 'PayTM', logo: 'https://cdn.razorpay.com/app/paytm.svg' },
    { name: 'CRED UPI', logo: 'https://cdn.razorpay.com/app/cred.svg', offer: 'Upto ₹50 cas...' },
    { name: 'BHIM', logo: 'https://cdn.razorpay.com/app/bhim.svg', offer: 'Upto ₹50 cas...' },
    { name: 'Apps & UPI...', logo: '', isMore: true },
  ];

  let {
    buttonStyleOverride,
    appBarLeadingStyleOverride,
    cardStyleOverride,
    previewVarsStyle = '',
    appBarSurfaceStyle = '',
  }: {
    buttonStyleOverride?: StyleOverride<ButtonSlot>;
    appBarLeadingStyleOverride?: StyleOverride<AppBarLeadingSlot>;
    cardStyleOverride?: StyleOverride<CardSlot>;
    previewVarsStyle?: string;
    appBarSurfaceStyle?: string;
  } = $props();
</script>

<div class="preview-root" style={previewVarsStyle}>
  <div class="phone-shell">
    <div class="phone-bezel">
      <div class="phone-status-bar" aria-hidden="true">
        <span class="phone-time">9:41</span>
        <span class="phone-status-icons">
          <span class="phone-signal"></span>
          <span class="phone-wifi"></span>
          <span class="phone-battery"></span>
        </span>
      </div>

      <div class="phone-viewport">
        <div class="app-bar-surface" style={appBarSurfaceStyle}>
          <AppBar variant="neutral" isSticky={false}>
            <AppBarLeading title="Maven Shop" trustBadgeVariant="default" styleOverride={appBarLeadingStyleOverride}>
              {#snippet logo()}
                <Avatar name="Maven Shop" variant="square" size="large" />
              {/snippet}
            </AppBarLeading>
            <AppBarActions>
              <IconButton icon={UserIcon} emphasis="subtle" accessibilityLabel="Profile" onClick={noop} />
            </AppBarActions>
          </AppBar>
        </div>

        <div class="checkout-scroll">
          <div class="checkout-content">
            <Heading size="small" weight="semibold">Payment Options</Heading>

            <section class="checkout-section">
              <Text size="small" weight="semibold" color="surface.text.gray.muted">Recommended</Text>
              <Card
                variant="primary"
                padding="spacing.4"
                styleOverride={cardStyleOverride}
                accessibilityLabel="Recommended UPI options"
              >
                <CardBody>
                  <div class="payment-list">
                    <button type="button" class="payment-row" onclick={noop}>
                      <img
                        class="payment-logo"
                        src="https://cdn.razorpay.com/app/googlepay.svg"
                        alt=""
                      />
                      <Text size="medium" weight="medium">UPI - Google Pay</Text>
                      <ChevronRightIcon size="medium" color="surface.icon.gray.muted" />
                    </button>
                    <Divider />
                    <button type="button" class="payment-row" onclick={noop}>
                      <img
                        class="payment-logo"
                        src="https://cdn.razorpay.com/app/phonepe.svg"
                        alt=""
                      />
                      <Text size="medium" weight="medium">UPI - PhonePe</Text>
                      <ChevronRightIcon size="medium" color="surface.icon.gray.muted" />
                    </button>
                  </div>
                </CardBody>
              </Card>
            </section>

            <section class="checkout-section">
              <Text size="small" weight="semibold" color="surface.text.gray.muted">
                All Payment Options
              </Text>
              <Accordion variant="transparent" defaultExpandedIndex={0} minWidth="0" maxWidth="100%">
                {#snippet children()}
                  <AccordionItem>
                    {#snippet children()}
                      <AccordionItemHeader title="UPI">
                        {#snippet leading()}
                          <CheckoutMethodIcon name="upi" />
                        {/snippet}
                        {#snippet titleSuffix()}
                          <Badge color="positive" emphasis="subtle" size="small">7 Offers</Badge>
                        {/snippet}
                      </AccordionItemHeader>
                      <AccordionItemBody>
                        {#snippet children()}
                          <div class="upi-grid">
                            {#each upiApps as app (app.name)}
                              <button type="button" class="upi-tile" onclick={noop}>
                                {#if app.isMore}
                                  <span class="upi-more-icon">
                                    <MoreFilledIcon size="medium" color="surface.icon.gray.normal" />
                                  </span>
                                {:else}
                                  <img class="upi-tile-logo" src={app.logo} alt="" />
                                {/if}
                                <Text size="small" weight="medium">{app.name}</Text>
                                {#if app.offer}
                                  <Text size="small" color="feedback.text.positive.intense">{app.offer}</Text>
                                {/if}
                              </button>
                            {/each}
                          </div>
                        {/snippet}
                      </AccordionItemBody>
                    {/snippet}
                  </AccordionItem>

                  <AccordionItem>
                    {#snippet children()}
                      <AccordionItemHeader title="Cards">
                        {#snippet leading()}
                          <CheckoutMethodIcon name="card" />
                        {/snippet}
                        {#snippet titleSuffix()}
                          <Badge color="positive" emphasis="subtle" size="small">
                            Unlimited 1% cashback with Amazon ...
                          </Badge>
                        {/snippet}
                      </AccordionItemHeader>
                      <AccordionItemBody>
                        <Text size="small" color="surface.text.gray.muted">
                          Pay with Visa, Mastercard, RuPay, or Amex.
                        </Text>
                      </AccordionItemBody>
                    {/snippet}
                  </AccordionItem>

                  <AccordionItem>
                    {#snippet children()}
                      <AccordionItemHeader title="Netbanking">
                        {#snippet leading()}
                          <CheckoutMethodIcon name="netbanking" />
                        {/snippet}
                      </AccordionItemHeader>
                      <AccordionItemBody>
                        <Text size="small" color="surface.text.gray.muted">
                          Pay via your bank account.
                        </Text>
                      </AccordionItemBody>
                    {/snippet}
                  </AccordionItem>

                  <AccordionItem>
                    {#snippet children()}
                      <AccordionItemHeader title="EMI">
                        {#snippet leading()}
                          <CheckoutMethodIcon name="emi" />
                        {/snippet}
                        {#snippet titleSuffix()}
                          <Badge color="positive" emphasis="subtle" size="small">
                            5% Cashback up to Rs 1000 on Min C...
                          </Badge>
                        {/snippet}
                      </AccordionItemHeader>
                      <AccordionItemBody>
                        <Text size="small" color="surface.text.gray.muted">
                          Convert to easy monthly instalments.
                        </Text>
                      </AccordionItemBody>
                    {/snippet}
                  </AccordionItem>

                  <AccordionItem>
                    {#snippet children()}
                      <AccordionItemHeader title="Pay Later">
                        {#snippet leading()}
                          <CheckoutMethodIcon name="paylater" />
                        {/snippet}
                      </AccordionItemHeader>
                      <AccordionItemBody>
                        <Text size="small" color="surface.text.gray.muted">
                          Simpl, LazyPay, and other pay-later options.
                        </Text>
                      </AccordionItemBody>
                    {/snippet}
                  </AccordionItem>
                {/snippet}
              </Accordion>
            </section>

            <Text size="small" color="surface.text.gray.muted" weight="medium">
              Secured by Razorpay · Account & Terms
            </Text>

            <AnnouncementBanner alignment="center" icon={InfoIcon}>
              Money Back Promise by Razorpay
            </AnnouncementBanner>
          </div>
        </div>

        <div class="checkout-footer">
          <Divider variant="subtle" />
          <div class="footer-bar">
            <div class="footer-amount">
              <Amount value={10000} size="large" weight="semibold" styleOverride={{ value: 'text-(--footer-amount-value)', currency: 'text-(--footer-amount-currency)' }} />
              <Link variant="button" color="neutral" size="small" onClick={noop}>View Details</Link>
            </div>
            <Button variant="primary" size="large" isFullWidth styleOverride={buttonStyleOverride} onClick={noop}>
              Continue
            </Button>
          </div>
        </div>
      </div>

      <div class="phone-home-indicator" aria-hidden="true"></div>
    </div>
  </div>
</div>

<style>
  .preview-root {
    --footer-amount-value: var(--surface-text-gray-normal);
    --footer-amount-currency: var(--surface-text-gray-muted);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100%;
    padding: var(--spacing-6);
    background-color: var(--surface-background-gray-intense);
  }

  .phone-shell {
    width: min(100%, 390px);
  }

  .phone-bezel {
    display: flex;
    flex-direction: column;
    border: 10px solid #1f1f1f;
    border-radius: 36px;
    background-color: #1f1f1f;
    box-shadow:
      0 24px 48px rgba(15, 23, 42, 0.18),
      inset 0 0 0 1px rgba(255, 255, 255, 0.08);
    overflow: hidden;
  }

  .phone-status-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px 6px;
    background-color: var(--surface-background-primary-intense);
    color: var(--interactive-text-on-primary-normal);
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
  }

  .phone-status-icons {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .phone-signal,
  .phone-wifi,
  .phone-battery {
    display: inline-block;
    background-color: currentColor;
    border-radius: 2px;
  }

  .phone-signal {
    width: 14px;
    height: 8px;
    clip-path: polygon(0 100%, 20% 60%, 40% 80%, 60% 40%, 80% 70%, 100% 20%, 100% 100%);
  }

  .phone-wifi {
    width: 12px;
    height: 8px;
    border-radius: 999px 999px 0 0;
    border: 2px solid currentColor;
    border-bottom: 0;
    background: transparent;
  }

  .phone-battery {
    width: 18px;
    height: 8px;
    border: 1px solid currentColor;
    background: linear-gradient(to right, currentColor 70%, transparent 70%);
  }

  .phone-viewport {
    display: flex;
    flex-direction: column;
    height: 720px;
    background-color: var(--surface-background-gray-moderate);
  }

  .app-bar-surface {
    flex-shrink: 0;
    background-color: var(--surface-background-primary-intense);
  }

  .checkout-scroll {
    flex: 1;
    overflow: auto;
    min-height: 0;
  }

  .checkout-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-5);
    padding: var(--spacing-5);
  }

  .checkout-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
  }

  .offer-row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-2);
  }

  .payment-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
  }

  .payment-row {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: var(--spacing-3);
    width: 100%;
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    text-align: left;
  }

  .payment-logo,
  .upi-tile-logo {
    width: 24px;
    height: 24px;
    object-fit: contain;
    flex-shrink: 0;
  }

  .upi-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--spacing-3);
  }

  .upi-tile {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-1);
    padding: var(--spacing-3);
    border: 1px solid var(--surface-border-gray-muted);
    border-radius: var(--border-radius-medium);
    background-color: var(--surface-background-gray-subtle);
    cursor: pointer;
    text-align: left;
  }

  .upi-more-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
  }

  .checkout-footer {
    flex-shrink: 0;
    background-color: var(--surface-background-gray-subtle);
  }

  .footer-bar {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
    gap: var(--spacing-3);
    align-items: center;
    padding: var(--spacing-4);
  }

  .footer-amount {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-1);
    align-items: flex-start;
  }

  .phone-home-indicator {
    width: 120px;
    height: 4px;
    margin: 10px auto 8px;
    border-radius: 999px;
    background-color: rgba(255, 255, 255, 0.72);
  }
</style>
