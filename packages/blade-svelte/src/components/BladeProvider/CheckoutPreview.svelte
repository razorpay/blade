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
  import AvatarGroup from '../Avatar/AvatarGroup.svelte';
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
  import BottomSheet from '../BottomSheet/BottomSheet.svelte';
  import BottomSheetHeader from '../BottomSheet/BottomSheetHeader.svelte';
  import BottomSheetBody from '../BottomSheet/BottomSheetBody.svelte';
  import BottomSheetFooter from '../BottomSheet/BottomSheetFooter.svelte';
  import PhoneNumberInput from '../Input/PhoneNumberInput/PhoneNumberInput.svelte';
  import CheckoutMethodIcon from './CheckoutMethodIcon.svelte';
  import RazorpayLogo from './RazorpayLogo.svelte';
  import { ChevronRightIcon, MoreHorizontalIcon, UserIcon } from '../Icons';

  const noop = (): void => undefined;

  const PRICE_SUMMARY_SUBTOTAL = 1000;
  const PRICE_SUMMARY_GRAND_TOTAL = 1000;

  let isPriceSummaryOpen = $state(false);
  let isContactDetailsOpen = $state(false);
  let phoneNumber = $state('8800726381');
  let editPhoneNumber = $state('8800726381');
  let phoneViewportEl = $state<HTMLDivElement | null>(null);

  const openPriceSummary = (): void => {
    isPriceSummaryOpen = true;
  };

  const closePriceSummary = (): void => {
    isPriceSummaryOpen = false;
  };

  const openContactDetails = (): void => {
    editPhoneNumber = phoneNumber;
    isContactDetailsOpen = true;
  };

  const closeContactDetails = (): void => {
    isContactDetailsOpen = false;
  };

  const saveContactDetails = (): void => {
    phoneNumber = editPhoneNumber;
    isContactDetailsOpen = false;
  };

  const upiApps: Array<{
    name: string;
    logo?: string;
    isMore?: boolean;
  }> = [
    { name: 'Google Pay', logo: 'https://cdn.razorpay.com/app/googlepay.svg' },
    { name: 'Paytm', logo: 'https://cdn.razorpay.com/app/paytm.svg' },
    { name: 'CRED', logo: 'https://cdn.razorpay.com/app/cred.svg' },
    { name: 'Other app', isMore: true },
  ];

  const upiHeaderApps = [
    { name: 'Google Pay', logo: 'https://cdn.razorpay.com/app/googlepay.svg' },
    { name: 'PhonePe', logo: 'https://cdn.razorpay.com/app/phonepe.svg' },
    { name: 'CRED', logo: 'https://cdn.razorpay.com/app/cred.svg' },
  ] as const;

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

      <div class="phone-viewport" bind:this={phoneViewportEl}>
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

          <div class="checkout-header-cards">
            <Card
              variant="primary"
              padding="spacing.4"
              marginTop="spacing.4"
              styleOverride={cardStyleOverride}
              accessibilityLabel="Price summary"
            >
              <CardBody>
                <div class="price-summary-card">
                  <Text size="medium" weight="medium" color="surface.text.gray.muted">Price summary</Text>
                  <Amount
                    value={2000}
                    suffix="none"
                    type="heading"
                    size="medium"
                    weight="semibold"
                    isAffixSubtle={false}
                  />
                </div>
              </CardBody>
            </Card>

            <Card
              variant="primary"
              padding="spacing.4"
              styleOverride={cardStyleOverride}
              accessibilityLabel="Phone number"
              onClick={openContactDetails}
            >
              <CardBody>
                <div class="phone-number-row">
                  <Text size="medium" weight="medium">+91 {phoneNumber}</Text>
                  <Link variant="button" color="primary" size="small" onClick={openContactDetails}>
                    Change
                  </Link>
                </div>
              </CardBody>
            </Card>
          </div>

          <div class="checkout-promo-banner">
            <AnnouncementBanner
              alignment="center"
              styleOverride={{ root: 'checkout-promo-banner-root', text: 'checkout-promo-banner-text' }}
            >
              🪔 Diwali sale Flat 10% Off
            </AnnouncementBanner>
          </div>
        </div>

        <div class="checkout-scroll">
          <div class="checkout-content">

            <section class="checkout-section">
              <Text size="medium" weight="medium" color="surface.text.gray.muted">Recommended</Text>
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
              <Text size="medium" weight="medium" color="surface.text.gray.muted">
                All Payment Options
              </Text>
              <Accordion variant="filled" hasGrayBody defaultExpandedIndex={0} minWidth="0" maxWidth="100%">
                {#snippet children()}
                  <AccordionItem>
                    {#snippet children()}
                      <AccordionItemHeader>
                        {#snippet leading()}
                          <CheckoutMethodIcon name="upi" />
                        {/snippet}
                        {#snippet children()}
                          <div class="accordion-header-content">
                            <div class="accordion-header-title-row">
                              <Text size="medium" weight="semibold">UPI</Text>
                              <AvatarGroup size="xsmall" density="comfortable">
                                {#each upiHeaderApps as app (app.name)}
                                  <Avatar name={app.name} src={app.logo} alt="" />
                                {/each}
                              </AvatarGroup>
                            </div>
                            <Badge color="positive" emphasis="subtle" size="small">7 Offers</Badge>
                          </div>
                        {/snippet}
                      </AccordionItemHeader>
                      <AccordionItemBody>
                        {#snippet children()}
                          <div class="upi-grid">
                            {#each upiApps as app (app.name)}
                              <Card
                                variant="primary"
                                padding="spacing.0"
                                size="medium"
                                accessibilityLabel={app.name}
                                onClick={noop}
                                styleOverride={cardStyleOverride}
                              >
                                <CardBody>
                                  <div class="upi-option-row">
                                    {#if app.isMore}
                                      <span class="upi-option-icon">
                                        <MoreHorizontalIcon size="medium" color="surface.icon.gray.normal" />
                                      </span>
                                    {:else if app.name === 'CRED'}
                                      <Avatar name={app.name} src={app.logo} alt="" size="xsmall" />
                                    {:else}
                                      <img class="upi-option-logo" src={app.logo} alt="" />
                                    {/if}
                                    <Text size="medium" weight="medium">{app.name}</Text>
                                    <ChevronRightIcon size="medium" color="surface.icon.gray.muted" />
                                  </div>
                                </CardBody>
                              </Card>
                            {/each}
                          </div>
                        {/snippet}
                      </AccordionItemBody>
                    {/snippet}
                  </AccordionItem>

                  <AccordionItem>
                    {#snippet children()}
                      <AccordionItemHeader>
                        {#snippet leading()}
                          <CheckoutMethodIcon name="card" />
                        {/snippet}
                        {#snippet children()}
                          <div class="accordion-header-content">
                            <div class="accordion-header-title-row">
                              <Text size="medium" weight="semibold">Cards</Text>
                            </div>
                            <Badge color="positive" emphasis="subtle" size="small">
                              Unlimited 1% cashback with Amazon ...
                            </Badge>
                          </div>
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
                      <AccordionItemHeader>
                        {#snippet leading()}
                          <CheckoutMethodIcon name="netbanking" />
                        {/snippet}
                        {#snippet children()}
                          <div class="accordion-header-content">
                            <div class="accordion-header-title-row">
                              <Text size="medium" weight="semibold">Netbanking</Text>
                            </div>
                          </div>
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
                      <AccordionItemHeader>
                        {#snippet leading()}
                          <CheckoutMethodIcon name="emi" />
                        {/snippet}
                        {#snippet children()}
                          <div class="accordion-header-content">
                            <div class="accordion-header-title-row">
                              <Text size="medium" weight="semibold">EMI</Text>
                            </div>
                            <Badge color="positive" emphasis="subtle" size="small">
                              5% Cashback up to Rs 1000 on Min C...
                            </Badge>
                          </div>
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
                      <AccordionItemHeader>
                        {#snippet leading()}
                          <CheckoutMethodIcon name="paylater" />
                        {/snippet}
                        {#snippet children()}
                          <div class="accordion-header-content">
                            <div class="accordion-header-title-row">
                              <Text size="medium" weight="semibold">Pay Later</Text>
                            </div>
                          </div>
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

            <div class="secured-by-row">
              <Text size="small" color="surface.text.gray.muted" weight="medium">
                Secured by
              </Text>
              <RazorpayLogo height={12} />
              <Text size="small" color="surface.text.gray.muted" weight="medium">
                · Account & Terms
              </Text>
            </div>
          </div>
        </div>

        <div class="checkout-footer">
          <Divider variant="subtle" />
          <div class="footer-bar">
            <div class="footer-amount">
              <Amount value={10000} size="large" weight="semibold" styleOverride={{ value: 'text-(--footer-amount-value)', currency: 'text-(--footer-amount-currency)' }} />
              <Link variant="button" color="neutral" size="small" onClick={openPriceSummary}>
                View Details
              </Link>
            </div>
            <Button variant="primary" size="large" isFullWidth styleOverride={buttonStyleOverride} onClick={noop}>
              Continue
            </Button>
          </div>
        </div>

        <BottomSheet
          isOpen={isPriceSummaryOpen}
          onDismiss={closePriceSummary}
          portalTarget={phoneViewportEl}
        >
          <BottomSheetHeader title="Price summary" />
          <BottomSheetBody>
            <div class="price-summary-sheet">
              <div class="price-summary-row">
                <Text size="medium" weight="regular">Subtotal</Text>
                <Amount value={PRICE_SUMMARY_SUBTOTAL} suffix="none" size="medium" weight="regular" />
              </div>
              <Divider dividerStyle="dashed" variant="subtle" />
              <div class="price-summary-row">
                <Text size="medium" weight="semibold">Grand Total</Text>
                <Amount
                  value={PRICE_SUMMARY_GRAND_TOTAL}
                  suffix="none"
                  size="medium"
                  weight="semibold"
                />
              </div>
            </div>
          </BottomSheetBody>
        </BottomSheet>

        <BottomSheet
          isOpen={isContactDetailsOpen}
          onDismiss={closeContactDetails}
          portalTarget={phoneViewportEl}
        >
          <BottomSheetHeader
            title="Edit contact details"
            subtitle="Enter mobile number to continue"
          />
          <BottomSheetBody>
            <PhoneNumberInput
              name="contact-phone"
              defaultCountry="IN"
              value={editPhoneNumber}
              portalTarget={phoneViewportEl}
              onChange={({ value }) => {
                editPhoneNumber = value;
              }}
            />
          </BottomSheetBody>
          <BottomSheetFooter>
            <Button
              variant="primary"
              size="large"
              isFullWidth
              styleOverride={buttonStyleOverride}
              onClick={saveContactDetails}
            >
              Continue
            </Button>
          </BottomSheetFooter>
        </BottomSheet>
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
    font-family: var(--font-family-text);
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
  }

  .phone-status-bar :global(span) {
    font-family: inherit;
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
    position: relative;
    display: flex;
    flex-direction: column;
    height: 720px;
    /* page canvas — createTheme `surface.background.page` → gray.moderate */
    background-color: var(--surface-background-gray-moderate);
    font-family: var(--font-family-text);
    transform: translateZ(0);
    overflow: hidden;
  }

  /*
   * Storybook preview-head forces Inter on most p/span/a nodes. BaseText (Amount,
   * AnnouncementBanner) is excluded and already follows --font-family-* tokens.
   * Re-apply theme text family on Typography/Button/Link/Badge inside the phone frame.
   */
  .phone-viewport :global([data-blade-component='text']),
  .phone-viewport :global([data-blade-component='button']),
  .phone-viewport :global([data-blade-component='link']),
  .phone-viewport :global([data-blade-component='badge']) {
    font-family: var(--font-family-text) !important;
  }

  .app-bar-surface {
    flex-shrink: 0;
    background-color: var(--surface-background-primary-intense);
  }

  .checkout-header-cards {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
    padding: 0 var(--spacing-5);
  }

  .price-summary-card {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
  }

  .phone-number-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-3);
  }

  .checkout-promo-banner {
    flex-shrink: 0;
    margin-top: var(--spacing-5);
  }

  :global(.checkout-promo-banner-root) {
    background-color: var(--interactive-background-static-black-faded-highlighted);
  }

  :global(.checkout-promo-banner-text) {
    color: var(--surface-text-static-white-subtle);
    font-family: var(--font-family-text);
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
  .upi-option-logo {
    width: 24px;
    height: 24px;
    object-fit: contain;
    flex-shrink: 0;
  }

  .accordion-header-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
    overflow: visible;
  }

  .accordion-header-title-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-3);
    flex-shrink: 0;
    overflow: visible;
  }

  .accordion-header-title-row :global(.avatar-group) {
    flex-shrink: 0;
    overflow: visible;
  }

  .accordion-header-title-row :global(.avatar-btn img) {
    object-fit: contain;
  }

  .upi-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--spacing-3);
  }

  .upi-option-row {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: var(--spacing-3);
    padding: 14px var(--spacing-3);
  }

  .upi-option-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
  }

  .secured-by-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-1);
  }

  .checkout-footer {
    flex-shrink: 0;
    background-color: var(--surface-background-gray-intense);
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

  :global(.text-\(--footer-amount-value\)) {
    color: var(--footer-amount-value);
  }

  :global(.text-\(--footer-amount-currency\)) {
    color: var(--footer-amount-currency);
  }

  .price-summary-sheet {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-4);
  }

  .price-summary-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-3);
  }

  .phone-home-indicator {
    width: 120px;
    height: 4px;
    margin: 10px auto 8px;
    border-radius: 999px;
    background-color: rgba(255, 255, 255, 0.72);
  }
</style>
