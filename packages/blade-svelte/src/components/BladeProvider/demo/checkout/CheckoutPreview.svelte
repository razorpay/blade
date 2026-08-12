<script lang="ts">
  import AppBar from '../../../AppBar/AppBar.svelte';
  import AppBarLeading from '../../../AppBar/AppBarLeading.svelte';
  import AppBarActions from '../../../AppBar/AppBarActions.svelte';
  import IconButton from '../../../Button/IconButton/IconButton.svelte';
  import Avatar from '../../../Avatar/Avatar.svelte';
  import AvatarGroup from '../../../Avatar/AvatarGroup.svelte';
  import Text from '../../../Typography/Text/Text.svelte';
  import Heading from '../../../Typography/Heading/Heading.svelte';
  import Card from '../../../Card/Card.svelte';
  import CardBody from '../../../Card/CardBody.svelte';
  import Button from '../../../Button/Button.svelte';
  import Amount from '../../../Amount/Amount.svelte';
  import Link from '../../../Link/Link.svelte';
  import AnnouncementBanner from '../../../AnnouncementBanner/AnnouncementBanner.svelte';
  import Accordion from '../../../Accordion/Accordion.svelte';
  import AccordionItem from '../../../Accordion/AccordionItem.svelte';
  import AccordionItemHeader from '../../../Accordion/AccordionItemHeader.svelte';
  import AccordionItemBody from '../../../Accordion/AccordionItemBody.svelte';
  import Divider from '../../../Divider/Divider.svelte';
  import BottomSheet from '../../../BottomSheet/BottomSheet.svelte';
  import BottomSheetHeader from '../../../BottomSheet/BottomSheetHeader.svelte';
  import BottomSheetBody from '../../../BottomSheet/BottomSheetBody.svelte';
  import BottomSheetFooter from '../../../BottomSheet/BottomSheetFooter.svelte';
  import ActionList from '../../../ActionList/ActionList.svelte';
  import ActionListItem from '../../../ActionList/ActionListItem.svelte';
  import ActionListItemIcon from '../../../ActionList/ActionListItemIcon.svelte';
  import PhoneNumberInput from '../../../Input/PhoneNumberInput/PhoneNumberInput.svelte';
  import CheckoutMethodIcon from './CheckoutMethodIcon.svelte';
  import RazorpayLogo from './RazorpayLogo.svelte';
  import { ChevronRightIcon, InfoIcon, MoreHorizontalIcon, UserIcon } from '../../../Icons';
  import type { RadiusKey } from './checkoutPlaygroundTheme';
  import type { AccordionVariantType } from '../../../Accordion/types';

  const noop = (): void => undefined;

  const PRICE_SUMMARY_SUBTOTAL = 1000;
  const PRICE_SUMMARY_GRAND_TOTAL = 1000;

  let isPriceSummaryOpen = $state(false);
  let isContactDetailsOpen = $state(false);
  let isAccountTermsOpen = $state(false);
  let isAccountOpen = $state(false);
  let isTermsOpen = $state(false);
  let phoneNumber = $state('8800726381');
  let editPhoneNumber = $state('8800726381');
  let phoneViewportEl = $state<HTMLDivElement | null>(null);

  const openPriceSummary = (): void => {
    isPriceSummaryOpen = true;
  };

  const closePriceSummary = (): void => {
    isPriceSummaryOpen = false;
  };

  const openAccountTerms = (): void => {
    isAccountTermsOpen = true;
  };

  /* Closing the root Account & Terms sheet tears down the whole stack. */
  const closeAccountTerms = (): void => {
    isAccountTermsOpen = false;
    isAccountOpen = false;
    isTermsOpen = false;
  };

  const openAccount = (): void => {
    isAccountOpen = true;
  };

  const closeAccount = (): void => {
    isAccountOpen = false;
  };

  const openTerms = (): void => {
    isTermsOpen = true;
  };

  const closeTerms = (): void => {
    isTermsOpen = false;
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

  const recommendedApps = [
    { name: 'Google Pay', logo: 'https://cdn.razorpay.com/app/googlepay.svg' },
    { name: 'Paytm', logo: 'https://cdn.razorpay.com/app/paytm.svg' },
  ] as const;

  // Method-specific brand logos sourced from the checkout CDN
  const cardNetworks = [
    { name: 'Visa', logo: 'https://cdn.razorpay.com/card-networks/visa.svg' },
    { name: 'Mastercard', logo: 'https://cdn.razorpay.com/card-networks/mastercard.svg' },
    { name: 'RuPay', logo: 'https://cdn.razorpay.com/card-networks/rupay.svg' },
    { name: 'Amex', logo: 'https://cdn.razorpay.com/card-networks/amex.svg' },
  ] as const;

  const netbankingBanks = [
    { name: 'SBI', logo: 'https://cdn.razorpay.com/bank/SBIN.gif' },
    { name: 'ICICI Bank', logo: 'https://cdn.razorpay.com/bank/ICIC.gif' },
    { name: 'HDFC Bank', logo: 'https://cdn.razorpay.com/bank/HDFC.gif' },
    { name: 'Axis Bank', logo: 'https://cdn.razorpay.com/bank/UTIB.gif' },
  ] as const;

  const emiBanks = [
    { name: 'HDFC Bank', logo: 'https://cdn.razorpay.com/bank/HDFC.gif' },
    { name: 'ICICI Bank', logo: 'https://cdn.razorpay.com/bank/ICIC.gif' },
    { name: 'Axis Bank', logo: 'https://cdn.razorpay.com/bank/UTIB.gif' },
  ] as const;

  const paylaterProviders = [
    { name: 'LazyPay', logo: 'https://cdn.razorpay.com/paylater/lazypay.svg' },
    { name: 'ICICI Bank', logo: 'https://cdn.razorpay.com/paylater/icic.svg' },
    { name: 'Amazon Pay', logo: 'https://cdn.razorpay.com/app/amazonpay.svg' },
  ] as const;

  /**
   * Slot overrides arrive through the surrounding `BladeProvider`'s `componentConfig`, so this
   * preview stays free of instance `styleOverride` props — an instance one would outrank the
   * studio panel and silently ignore its edits.
   */
  let {
    previewVarsStyle = '',
    appBarSurfaceStyle = '',
    pulseRadiusKeys = [],
    pulseNonce = 0,
    accordionVariant = 'filled',
  }: {
    previewVarsStyle?: string;
    appBarSurfaceStyle?: string;
    /** One-shot pulse on every element bound to one of these radius tokens (radius edited). */
    pulseRadiusKeys?: RadiusKey[];
    /** Bumped by the parent on each edit so an unchanged radius still re-triggers the pulse. */
    pulseNonce?: number;
    /**
     * Checkout renders the method Accordion as `filled` (a fixed shell that discards
     * `styleOverride`). The studio flips this to `transparent` while Accordion is the active
     * override target so its seeded slot classes actually paint.
     */
    accordionVariant?: AccordionVariantType;
  } = $props();

  const PULSE_DURATION_MS = 700;
  // Overlays (bottom sheets, menus) mount on demand, so they miss the edit-time scan.
  // Keep the pulse "armed" this long after an edit so opening one still flashes it.
  const PULSE_OVERLAY_GRACE_MS = 12000;
  // Sentinel radius used to probe which elements are bound to a token's CSS var. Chosen
  // to not collide with any real token px so the match is unambiguous.
  const RADIUS_PROBE_PX = 111;
  const RADIUS_PROBE_TOLERANCE_PX = 1.5;

  const elementsIn = (node: HTMLElement): HTMLElement[] => [
    node,
    ...node.querySelectorAll<HTMLElement>('*'),
  ];

  /**
   * Token-accurate matcher. Matching by resolved px is ambiguous — two tokens can share a
   * value (e.g. `small` at 12px collides with default `medium`), which flashed everything.
   * Instead, briefly override each token's CSS var on the scan root with a sentinel px,
   * read back which candidates now resolve to it, then restore. Set→read→restore runs
   * synchronously, so the browser never paints the sentinel (no flicker). Works even when
   * the token is 0px, since the override replaces the value outright.
   */
  function probeTokenMatches(
    root: HTMLElement,
    keys: RadiusKey[],
    candidates: HTMLElement[],
  ): HTMLElement[] {
    const found = new Set<HTMLElement>();
    for (const key of keys) {
      const varName = `--border-radius-${key}`;
      const previous = root.style.getPropertyValue(varName);
      root.style.setProperty(varName, `${RADIUS_PROBE_PX}px`);
      for (const el of candidates) {
        const radius = Number.parseFloat(getComputedStyle(el).borderTopLeftRadius);
        if (Number.isFinite(radius) && Math.abs(radius - RADIUS_PROBE_PX) <= RADIUS_PROBE_TOLERANCE_PX) {
          found.add(el);
        }
      }
      if (previous) root.style.setProperty(varName, previous);
      else root.style.removeProperty(varName);
    }
    return [...found];
  }

  /** Fire the one-shot pulse animation on an element (reflow restarts it on rapid edits). */
  function pulseElement(el: HTMLElement): void {
    el.classList.remove('radius-locate-pulse');
    void el.offsetWidth;
    el.classList.add('radius-locate-pulse');
    setTimeout(() => el.classList.remove('radius-locate-pulse'), PULSE_DURATION_MS);
  }

  // Pulse: flash matches once after an edit (nonce re-runs even on same value).
  // Mounted matches flash now; the observer keeps flashing newly-mounted overlays
  // (bottom sheets, menus) for a grace window so their corners aren't a silent change.
  $effect(() => {
    void pulseNonce;
    const root = phoneViewportEl;
    if (!root || pulseRadiusKeys.length === 0) return;
    const keys = pulseRadiusKeys;

    for (const el of probeTokenMatches(root, keys, elementsIn(root))) pulseElement(el);

    const observer = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          for (const el of probeTokenMatches(root, keys, elementsIn(node))) pulseElement(el);
        }
      }
    });
    observer.observe(root, { childList: true, subtree: true });
    const stopTimer = setTimeout(() => observer.disconnect(), PULSE_OVERLAY_GRACE_MS);
    return () => {
      observer.disconnect();
      clearTimeout(stopTimer);
    };
  });
</script>

<div class="preview-root" style={previewVarsStyle}>
  <div class="phone-shell">
    <div class="phone-viewport" bind:this={phoneViewportEl}>
      <div class="app-bar-surface" style={appBarSurfaceStyle}>
        <div class="phone-status-bar" aria-hidden="true">
          <span class="phone-time">9:41</span>
          <span class="phone-status-icons">
            <span class="phone-signal"></span>
            <span class="phone-wifi"></span>
            <span class="phone-battery"></span>
          </span>
        </div>

          <AppBar
            variant="neutral"
            isSticky={false}
            showBackButton
            onBackButtonClick={noop}
            backButtonAccessibilityLabel="Go back"
          >
            <AppBarLeading title="Maven Shop" trustBadgeVariant="default">
              {#snippet logo()}
                <Avatar name="Maven Shop" variant="square" size="large" />
              {/snippet}
            </AppBarLeading>
            <AppBarActions>
              <IconButton icon={UserIcon} emphasis="subtle" accessibilityLabel="Profile" onClick={openAccountTerms} />
            </AppBarActions>
          </AppBar>

          <div class="checkout-header-cards">
            <Card
              variant="primary"
              padding="spacing.4"
              marginTop="spacing.4"
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

          <div class="checkout-promo-banner" >
            <AnnouncementBanner alignment="center" icon={InfoIcon}>
              Diwali sale Flat 10% Off
            </AnnouncementBanner>
          </div>
        </div>

        <div class="checkout-scroll">
          <Heading size="medium" marginX="spacing.5" marginTop="spacing.5">
            Payment options
          </Heading>
          <div class="checkout-content">

            <section class="checkout-section">
              <Text size="medium" weight="medium" color="surface.text.gray.muted">Recommended</Text>
              <Card
                variant="primary"
                padding="spacing.0"
                accessibilityLabel="Recommended UPI options"
              >
                <CardBody>
                  <div class="payment-list">
                    {#each recommendedApps as app, index (app.name)}
                      {#if index > 0}
                        <Divider />
                      {/if}
                      <button type="button" class="payment-row" onclick={noop}>
                        <img class="payment-logo" src={app.logo} alt="" />
                        <Text size="medium" weight="medium">{app.name}</Text>
                        <ChevronRightIcon size="medium" color="surface.icon.gray.muted" />
                      </button>
                    {/each}
                  </div>
                </CardBody>
              </Card>
            </section>

            <section class="checkout-section">
              <Text size="medium" weight="medium" color="surface.text.gray.muted">
                All Payment Options
              </Text>
              <Accordion variant={accordionVariant} hasGrayBody={accordionVariant === 'filled'} defaultExpandedIndex={0} minWidth="0" maxWidth="100%">
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
                                height="100%"
                                accessibilityLabel={app.name}
                                onClick={noop}
                              >
                                <CardBody>
                                  <div class="upi-option-row">
                                    {#if app.isMore}
                                      <span class="upi-option-icon">
                                        <MoreHorizontalIcon size="medium" color="surface.icon.gray.normal" />
                                      </span>
                                    {:else if app.name === 'CRED'}
                                      <span class="upi-option-icon">
                                        <Avatar name={app.name} src={app.logo} alt="" size="xsmall" />
                                      </span>
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
                              <AvatarGroup size="xsmall" density="comfortable">
                                {#each cardNetworks as network (network.name)}
                                  <Avatar name={network.name} src={network.logo} alt="" />
                                {/each}
                              </AvatarGroup>
                            </div>
                          </div>
                        {/snippet}
                      </AccordionItemHeader>
                      <AccordionItemBody>
                        <Text size="small" color="surface.text.gray.muted">
                          Pay using credit or debit card.
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
                              <AvatarGroup size="xsmall" density="comfortable">
                                {#each netbankingBanks as bank (bank.name)}
                                  <Avatar name={bank.name} src={bank.logo} alt="" />
                                {/each}
                              </AvatarGroup>
                            </div>
                            <Text size="small" weight="regular" color="feedback.text.positive.intense">
                              Save ₹150
                            </Text>
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
                              <AvatarGroup size="xsmall" density="comfortable">
                                {#each emiBanks as bank (bank.name)}
                                  <Avatar name={bank.name} src={bank.logo} alt="" />
                                {/each}
                              </AvatarGroup>
                            </div>
                            <Text size="small" weight="regular" color="feedback.text.positive.intense">
                              Starting from 1500/mo
                            </Text>
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
                              <AvatarGroup size="xsmall" density="comfortable">
                                {#each paylaterProviders as provider (provider.name)}
                                  <Avatar name={provider.name} src={provider.logo} alt="" />
                                {/each}
                              </AvatarGroup>
                            </div>
                          </div>
                        {/snippet}
                      </AccordionItemHeader>
                      <AccordionItemBody>
                        <Text size="small" color="surface.text.gray.muted">
                          Buy now and pay later in easy instalments.
                        </Text>
                      </AccordionItemBody>
                    {/snippet}
                  </AccordionItem>

                  <AccordionItem>
                    {#snippet children()}
                      <AccordionItemHeader>
                        {#snippet leading()}
                          <CheckoutMethodIcon name="cod" />
                        {/snippet}
                        {#snippet children()}
                          <div class="accordion-header-content">
                            <div class="accordion-header-title-row">
                              <Text size="medium" weight="semibold">Cash On Delivery</Text>
                            </div>
                            <Text size="small" weight="regular" color="feedback.text.negative.intense">
                              +50 Extra Charge
                            </Text>
                          </div>
                        {/snippet}
                      </AccordionItemHeader>
                      <AccordionItemBody>
                        <Text size="small" color="surface.text.gray.muted">
                          Pay with cash when your order is delivered.
                        </Text>
                      </AccordionItemBody>
                    {/snippet}
                  </AccordionItem>
                {/snippet}
              </Accordion>
            </section>

            <div class="secured-by-row">
              <Text size="small" color="surface.text.gray.muted" weight="regular">
                Secured by
              </Text>
              <RazorpayLogo height={12} />
              <Text size="small" color="surface.text.gray.muted" weight="regular">
                · Account & Terms
              </Text>
            </div>
          </div>
        </div>

        <div class="checkout-footer">
          <Divider variant="subtle" />
          <div class="footer-bar">
            <div class="footer-amount">
              <Amount value={2000} size="large" weight="semibold" />
              <Link variant="button" color="neutral" size="small" onClick={openPriceSummary}>
                View Details
              </Link>
            </div>
            <Button variant="primary" size="large" isFullWidth onClick={noop}>
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
              onClick={saveContactDetails}
            >
              Continue
            </Button>
          </BottomSheetFooter>
        </BottomSheet>

        <BottomSheet
          isOpen={isAccountTermsOpen}
          onDismiss={closeAccountTerms}
          portalTarget={phoneViewportEl}
        >
          <BottomSheetHeader title="Account & Terms" />
          <BottomSheetBody hasActionList>
            <ActionList>
              {#snippet children()}
                <ActionListItem title="Account" description="Contact, Login" value="account" onClick={openAccount}>
                  {#snippet leading()}
                    <ActionListItemIcon icon={UserIcon} />
                  {/snippet}
                  {#snippet trailing()}
                    <ChevronRightIcon size="medium" color="surface.icon.gray.muted" />
                  {/snippet}
                </ActionListItem>
                <ActionListItem title="Razorpay T&Cs" description="Policies, Terms of service" value="terms" onClick={openTerms}>
                  {#snippet leading()}
                    <span class="menu-leading-svg">{@render fileTextIcon()}</span>
                  {/snippet}
                  {#snippet trailing()}
                    <ChevronRightIcon size="medium" color="surface.icon.gray.muted" />
                  {/snippet}
                </ActionListItem>
                <ActionListItem title="Language" description="English" value="language" onClick={noop}>
                  {#snippet leading()}
                    <span class="menu-leading-svg">{@render translateIcon()}</span>
                  {/snippet}
                  {#snippet trailing()}
                    <ChevronRightIcon size="medium" color="surface.icon.gray.muted" />
                  {/snippet}
                </ActionListItem>
              {/snippet}
            </ActionList>
          </BottomSheetBody>
        </BottomSheet>

        <BottomSheet
          isOpen={isAccountOpen}
          onDismiss={closeAccount}
          portalTarget={phoneViewportEl}
        >
          <BottomSheetHeader title="Account" />
          <BottomSheetBody hasActionList>
            <ActionList>
              {#snippet children()}
                <ActionListItem title="Edit contact details" value="edit-contact" onClick={openContactDetails}>
                  {#snippet trailing()}
                    <ChevronRightIcon size="medium" color="surface.icon.gray.muted" />
                  {/snippet}
                </ActionListItem>
                <ActionListItem title="Login" value="login" onClick={noop}>
                  {#snippet trailing()}
                    <ActionListItemIcon icon={UserIcon} />
                  {/snippet}
                </ActionListItem>
              {/snippet}
            </ActionList>
          </BottomSheetBody>
        </BottomSheet>

        <BottomSheet
          isOpen={isTermsOpen}
          onDismiss={closeTerms}
          portalTarget={phoneViewportEl}
        >
          <BottomSheetHeader title="Razorpay T&Cs" />
          <BottomSheetBody hasActionList>
            <ActionList>
              {#snippet children()}
                <ActionListItem
                  title="Razorpay Terms of Service"
                  value="tos"
                  href="https://razorpay.com/terms/"
                  target="_blank"
                >
                  {#snippet trailing()}
                    <span class="menu-leading-svg">{@render externalLinkIcon()}</span>
                  {/snippet}
                </ActionListItem>
              {/snippet}
            </ActionList>
          </BottomSheetBody>
        </BottomSheet>
    </div>

    <img
      class="phone-frame"
      src="https://checkout-static-next.razorpay.com/build/customize/assets/mobile-frame-BWT5QWJP.png"
      alt=""
      aria-hidden="true"
      draggable="false"
    />
  </div>
</div>

{#snippet fileTextIcon()}
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="16" y2="17" />
    <line x1="8" y1="9" x2="10" y2="9" />
  </svg>
{/snippet}

{#snippet translateIcon()}
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M4 5h7" />
    <path d="M7 4c0 4.5-2 8-5 10" />
    <path d="M5 8c1.5 2.5 4 4.5 6 5.5" />
    <path d="M11 20l4-9 4 9" />
    <path d="M12.5 17h5" />
  </svg>
{/snippet}

{#snippet externalLinkIcon()}
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
{/snippet}

<style>
  .preview-root {
    --footer-amount-value: var(--surface-text-gray-normal);
    --footer-amount-currency: var(--surface-text-gray-muted);
    --radius-locate-color: #ffb800;
    --radius-locate-color-soft: rgba(255, 184, 0, 0.45);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: max-content;
  }

  /*
   * Device frame is a transparent PNG overlay (native 342×690, screen rect inset
   * L5.556% T2.319% W88.6% H95.362%, inner corner radius ~7.3% of width). Scaled
   * ×1.287 so the screen area lands at ~390×847 (iPhone 13 logical viewport).
   */
  .phone-shell {
    position: relative;
    width: 440px;
    height: 888px;
    flex-shrink: 0;
  }

  .phone-frame {
    position: absolute;
    inset: 0;
    z-index: 3;
    width: 100%;
    height: 100%;
    pointer-events: none;
    user-select: none;
    filter: drop-shadow(0 24px 48px rgba(15, 23, 42, 0.18));
  }

  .phone-status-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    /* generous side padding keeps the time/icons out of the frame's centered notch */
    padding: 14px 26px 6px;
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
    position: absolute;
    top: 2.319%;
    left: 5.556%;
    z-index: 1;
    display: flex;
    flex-direction: column;
    width: 88.6%;
    height: 95.362%;
    /* matches the frame PNG's inner screen corner radius (~7.3% of frame width) */
    border-radius: 32px;
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
    /* strip the rounded content sheet overlaps; matches banner fill so the sheet's
       top corners reveal banner color instead of a seam */
    padding-bottom: var(--spacing-4);
    /* clips the banner root's square top corners to the wrapper's rounding */
    overflow: hidden;
    background-color: var(--interactive-background-static-black-faded-highlighted);
  }

  .checkout-scroll {
    flex: 1;
    overflow: auto;
    min-height: 0;
    margin-top: calc(-1 * var(--spacing-4));
    /* push the top corner cutouts past the phone viewport's clip so only the
       banner's rounding reads at the edges; padding cancels the width gain */
    margin-inline: calc(-1 * var(--border-radius-medium));
    padding-inline: var(--border-radius-medium);
    border-radius: var(--border-radius-medium) var(--border-radius-medium) 0 0;
    background-color: var(--surface-background-gray-intense);
  }

  .checkout-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-7);
    padding: var(--spacing-5);
  }

  .checkout-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
  }

  .payment-list {
    display: flex;
    flex-direction: column;
  }

  .payment-row {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: var(--spacing-3);
    width: 100%;
    margin: 0;
    padding: var(--spacing-4);
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
    /* Match the fixed slot height the accordion header gives its leading/chevron
       slots so the title centers on the same axis as the leading icon. */
    min-height: var(--header-slot-height, 28px);
  }

  .accordion-header-title-row :global(.avatar-group) {
    flex-shrink: 0;
    overflow: visible;
  }

  /* blade-core hashes CSS-module class names, so target the avatar logo <img>
     directly — it is the only image rendered inside the title row. */
  .accordion-header-title-row :global(img) {
    object-fit: contain !important;
    box-sizing: border-box;
    padding: 2px;
    background-color: #fff;
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
    padding: var(--spacing-4) var(--spacing-5) var(--spacing-7);
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

  /* Wrapper for the inline SVGs used as ActionListItem leading/trailing slots
     (blade-svelte lacks file-text / translate / external-link icons). Colored
     to match ActionListItemIcon's `interactive.icon.gray.normal`. */
  .menu-leading-svg {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--interactive-icon-gray-normal);
  }

  /*
   * Radius "locate" affordances. Rings are injected as classes onto matched blade
   * elements from CheckoutPreview's runtime scan. Inset box-shadow is used so the ring
   * follows each element's own border-radius and is never clipped by an ancestor's
   * overflow:hidden (cards, accordion, scroll area all clip). !important beats the
   * component's own shadow tokens for the duration of the highlight.
   */
  .phone-viewport :global(.radius-locate-pulse) {
    animation: radius-locate-pulse 700ms ease-out;
  }

  @keyframes radius-locate-pulse {
    0% {
      box-shadow:
        inset 0 0 0 3px var(--radius-locate-color),
        0 0 0 5px var(--radius-locate-color-soft);
    }
    100% {
      box-shadow:
        inset 0 0 0 0 transparent,
        0 0 0 0 transparent;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .phone-viewport :global(.radius-locate-pulse) {
      animation-duration: 1ms;
    }
  }

</style>
