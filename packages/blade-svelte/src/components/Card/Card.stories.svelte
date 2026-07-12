<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Card from './Card.svelte';

  const { Story } = defineMeta({
    title: 'Components/Card',
    component: Card,
    tags: ['autodocs'],
    argTypes: {
      children: {
        control: false,
        table: { disable: true },
      },
      variant: {
        control: 'radio',
        options: ['primary', 'secondary', 'theme'],
      },
      backgroundColor: {
        control: 'select',
        options: [
          'surface.background.gray.intense',
          'surface.background.gray.moderate',
          'surface.background.gray.subtle',
          'surface.background.primary.subtle',
          'surface.background.primary.intense',
          'surface.background.sea.subtle',
          'surface.background.sea.intense',
          'surface.background.cloud.subtle',
          'surface.background.cloud.intense',
        ],
      },
      borderRadius: {
        control: 'select',
        options: ['medium', 'large', 'xlarge'],
      },
      padding: {
        control: 'radio',
        options: ['spacing.0', 'spacing.3', 'spacing.4', 'spacing.5', 'spacing.7'],
      },
    },
    args: {
      variant: 'theme',
      backgroundColor: 'surface.background.primary.subtle',
      borderRadius: 'medium',
      padding: 'spacing.7',
    },
  });
</script>

<script lang="ts">
  import TicketCard from './TicketCard.svelte';
  import TicketCardBody from './TicketCardBody.svelte';
  import TicketCardFooter from './TicketCardFooter.svelte';
  import InfoCard from './InfoCard.svelte';
  import InfoCardBody from './InfoCardBody.svelte';
  import InfoCardFooter from './InfoCardFooter.svelte';
  import CardBody from './CardBody.svelte';
  import CardHeader from './CardHeader.svelte';
  import CardHeaderLeading from './CardHeaderLeading.svelte';
  import CardHeaderTrailing from './CardHeaderTrailing.svelte';
  import CardHeaderIcon from './CardHeaderIcon.svelte';
  import CardHeaderCounter from './CardHeaderCounter.svelte';
  import CardHeaderBadge from './CardHeaderBadge.svelte';
  import CardHeaderIconButton from './CardHeaderIconButton.svelte';
  import CardFooter from './CardFooter.svelte';
  import CardFooterLeading from './CardFooterLeading.svelte';
  import CardFooterTrailing from './CardFooterTrailing.svelte';
  import Text from '../Typography/Text/Text.svelte';
  import Heading from '../Typography/Heading/Heading.svelte';
  import Amount from '../Amount/Amount.svelte';
  import { CreditCardIcon, InfoIcon, CloseIcon, CheckIcon, SearchIcon, ChevronRightIcon } from '../Icons';
  import type { CardBackgroundColor } from '@razorpay/blade-core/styles';
  import type { CardSpacingValueType } from './types';

  type CardStoryArgs = {
    variant?: 'primary' | 'secondary' | 'theme';
    backgroundColor?: CardBackgroundColor;
    borderRadius?: 'medium' | 'large' | 'xlarge';
    padding?: CardSpacingValueType;
  };

  type CardSurfaceArgs =
    | { variant?: 'primary' | 'secondary'; backgroundColor?: never; borderRadius?: 'medium' | 'large' | 'xlarge'; padding?: CardSpacingValueType }
    | { variant: 'theme'; backgroundColor?: CardBackgroundColor; borderRadius?: 'medium' | 'large' | 'xlarge'; padding?: CardSpacingValueType };

  function getCardSurfaceProps(args: CardStoryArgs): CardSurfaceArgs {
    const common = { borderRadius: args.borderRadius, padding: args.padding };
    if (args.variant === 'theme') {
      return { ...common, variant: 'theme', backgroundColor: args.backgroundColor };
    }
    // The Playground only exercises the standard surface treatments; TicketCard and InfoCard have
    // their own dedicated stories.
    const standardVariant = args.variant === 'secondary' ? 'secondary' : 'primary';
    return { ...common, variant: standardVariant };
  }
</script>

<!-- Playground — args-driven; Controls panel updates Card surface props -->
<Story name="Playground">
  {#snippet template(args)}
    <div
      style="background-color: var(--surface-background-gray-moderate); padding: var(--spacing-8);"
    >
      <Card {...getCardSurfaceProps(args)}>
        <CardHeader>
          <CardHeaderLeading
            title="Payment Links"
            subtitle="Share payment link via an email, SMS, messenger, chatbot etc."
          >
            {#snippet prefix()}
              <CardHeaderIcon icon={CreditCardIcon} />
            {/snippet}
            {#snippet suffix()}
              <CardHeaderCounter value={12} />
            {/snippet}
          </CardHeaderLeading>
          <CardHeaderTrailing>
            {#snippet visual()}
              <CardHeaderBadge color="positive">NEW</CardHeaderBadge>
            {/snippet}
          </CardHeaderTrailing>
        </CardHeader>
        <CardBody>
          <Text>
            Create Razorpay Payments Links and share them with your customers from the Razorpay Dashboard or using APIs and start accepting payments. Check the advantages, payment methods, international currency support and more.
          </Text>
        </CardBody>
        <CardFooter>
          <CardFooterLeading title="Built for Developers" subtitle="By Developers." />
          <CardFooterTrailing
            actions={{
              primary: {
                text: 'Learn More',
                onClick: () => console.log('Primary Action Clicked'),
              },
              secondary: {
                text: 'Try Demo',
                onClick: () => console.log('Secondary Action Clicked'),
              },
            }}
          />
        </CardFooter>
      </Card>
    </div>
  {/snippet}
</Story>

<!-- Story 1: Card Example
     React renders a split light+dark layout via a scoped <BladeProvider colorScheme="dark">.
     Svelte's BladeProvider isn't migrated yet and dark tokens are body-scoped in theme.css,
     so we keep React's split-pane structure (gray.moderate backdrops, two cards side by side)
     but render both halves in light mode. TODO: re-enable dark half once Svelte BladeProvider
     (or a scoped theme primitive) ships. -->
<Story name="Card Example" asChild>
  <div style="display: flex;">
    <div
      style="background-color: var(--surface-background-gray-moderate); padding: var(--spacing-8);"
    >
      <Card>
        <CardHeader>
          <CardHeaderLeading
            title="Payment Links"
            subtitle="Share payment link via an email, SMS, messenger, chatbot etc."
          >
            {#snippet prefix()}
              <CardHeaderIcon icon={CreditCardIcon} />
            {/snippet}
            {#snippet suffix()}
              <CardHeaderCounter value={12} />
            {/snippet}
          </CardHeaderLeading>
          <CardHeaderTrailing>
            {#snippet visual()}
              <CardHeaderBadge color="positive">NEW</CardHeaderBadge>
            {/snippet}
          </CardHeaderTrailing>
        </CardHeader>
        <CardBody>
          <Text>
            Create Razorpay Payments Links and share them with your customers from the Razorpay Dashboard or using APIs and start accepting payments. Check the advantages, payment methods, international currency support and more.
          </Text>
        </CardBody>
        <CardFooter>
          <CardFooterLeading title="Built for Developers" subtitle="By Developers." />
          <CardFooterTrailing
            actions={{
              primary: {
                text: 'Learn More',
                onClick: () => console.log('Primary Action Clicked'),
              },
              secondary: {
                text: 'Try Demo',
                onClick: () => console.log('Secondary Action Clicked'),
              },
            }}
          />
        </CardFooter>
      </Card>
    </div>
    <div
      style="background-color: var(--surface-background-gray-moderate); padding: var(--spacing-8);"
    >
      <Card>
        <CardHeader>
          <CardHeaderLeading
            title="Payment Links"
            subtitle="Share payment link via an email, SMS, messenger, chatbot etc."
          >
            {#snippet prefix()}
              <CardHeaderIcon icon={CreditCardIcon} />
            {/snippet}
            {#snippet suffix()}
              <CardHeaderCounter value={12} />
            {/snippet}
          </CardHeaderLeading>
          <CardHeaderTrailing>
            {#snippet visual()}
              <CardHeaderBadge color="positive">NEW</CardHeaderBadge>
            {/snippet}
          </CardHeaderTrailing>
        </CardHeader>
        <CardBody>
          <Text>
            Create Razorpay Payments Links and share them with your customers from the Razorpay Dashboard or using APIs and start accepting payments. Check the advantages, payment methods, international currency support and more.
          </Text>
        </CardBody>
        <CardFooter>
          <CardFooterLeading title="Built for Developers" subtitle="By Developers." />
          <CardFooterTrailing
            actions={{
              primary: {
                text: 'Learn More',
                onClick: () => console.log('Primary Action Clicked'),
              },
              secondary: {
                text: 'Try Demo',
                onClick: () => console.log('Secondary Action Clicked'),
              },
            }}
          />
        </CardFooter>
      </Card>
    </div>
  </div>
</Story>

<!-- Story 2: Figma Example — same layout note as Story 1 (dark half intentionally omitted). -->
<Story name="Figma Example" asChild>
  <div style="display: flex;">
    <div
      style="background-color: var(--surface-background-gray-moderate); padding: var(--spacing-8);"
    >
      <Card>
        <CardHeader>
          <CardHeaderLeading title="Header Title" subtitle="Header Subtitle">
            {#snippet prefix()}
              <CardHeaderIcon icon={CheckIcon} />
            {/snippet}
            {#snippet suffix()}
              <CardHeaderCounter value={12} />
            {/snippet}
          </CardHeaderLeading>
          <CardHeaderTrailing>
            {#snippet visual()}
              <CardHeaderBadge color="positive">NEW</CardHeaderBadge>
            {/snippet}
          </CardHeaderTrailing>
        </CardHeader>
        <CardBody>
          <Text>
            Create Razorpay Payments Links and share them with your customers from the Razorpay Dashboard or using APIs and start accepting payments. Check the advantages, payment methods, international currency support and more.
          </Text>
        </CardBody>
        <CardFooter>
          <CardFooterLeading title="Footer Title" subtitle="Footer Subtitle" />
          <CardFooterTrailing
            actions={{
              primary: {
                text: 'Learn More',
                onClick: () => console.log('Primary Action Clicked'),
              },
              secondary: {
                text: 'Try Demo',
                onClick: () => console.log('Secondary Action Clicked'),
              },
            }}
          />
        </CardFooter>
      </Card>
    </div>
    <div
      style="background-color: var(--surface-background-gray-moderate); padding: var(--spacing-8);"
    >
      <Card>
        <CardHeader>
          <CardHeaderLeading title="Header Title" subtitle="Header Subtitle">
            {#snippet prefix()}
              <CardHeaderIcon icon={CheckIcon} />
            {/snippet}
            {#snippet suffix()}
              <CardHeaderCounter value={12} />
            {/snippet}
          </CardHeaderLeading>
          <CardHeaderTrailing>
            {#snippet visual()}
              <CardHeaderBadge color="positive">NEW</CardHeaderBadge>
            {/snippet}
          </CardHeaderTrailing>
        </CardHeader>
        <CardBody>
          <Text>
            Create Razorpay Payments Links and share them with your customers from the Razorpay Dashboard or using APIs and start accepting payments. Check the advantages, payment methods, international currency support and more.
          </Text>
        </CardBody>
        <CardFooter>
          <CardFooterLeading title="Footer Title" subtitle="Footer Subtitle" />
          <CardFooterTrailing
            actions={{
              primary: {
                text: 'Learn More',
                onClick: () => console.log('Primary Action Clicked'),
              },
              secondary: {
                text: 'Try Demo',
                onClick: () => console.log('Secondary Action Clicked'),
              },
            }}
          />
        </CardFooter>
      </Card>
    </div>
  </div>
</Story>

<!-- Story 3: Card Body Content -->
<Story name="Card Body Content" asChild>
  <Card>
    <CardHeader>
      <CardHeaderLeading
        title="Profile Information"
        subtitle="We will use this information to keep your account updated"
      >
        {#snippet prefix()}
          <CardHeaderIcon icon={InfoIcon} />
        {/snippet}
      </CardHeaderLeading>
      <CardHeaderTrailing>
        {#snippet visual()}
          <CardHeaderIconButton icon={CloseIcon} />
        {/snippet}
      </CardHeaderTrailing>
    </CardHeader>
    <CardBody>
      <div style="display: flex; flex-direction: row; gap: 16px;">
        <div style="flex: 1;">
          <label style="display: block; font-size: 14px; margin-bottom: 4px; color: var(--surface-text-gray-subtle);">
            First Name *
            <input type="text" placeholder="Enter your first name" style="width: 100%; padding: 8px; border: 1px solid var(--surface-border-gray-muted); border-radius: 4px; box-sizing: border-box; margin-top: 4px;" />
          </label>
        </div>
        <div style="flex: 1;">
          <label style="display: block; font-size: 14px; margin-bottom: 4px; color: var(--surface-text-gray-subtle);">
            Last Name *
            <input type="text" placeholder="Enter your last name" style="width: 100%; padding: 8px; border: 1px solid var(--surface-border-gray-muted); border-radius: 4px; box-sizing: border-box; margin-top: 4px;" />
          </label>
        </div>
      </div>
      <div style="margin-top: 16px;">
        <label style="display: block; font-size: 14px; margin-bottom: 4px; color: var(--surface-text-gray-subtle);">
          Address Line 1 *
          <input type="text" placeholder="Apartment name, number, suite, etc." style="width: 100%; padding: 8px; border: 1px solid var(--surface-border-gray-muted); border-radius: 4px; box-sizing: border-box; margin-top: 4px;" />
        </label>
      </div>
      <div style="margin-top: 16px;">
        <label style="display: block; font-size: 14px; margin-bottom: 4px; color: var(--surface-text-gray-subtle);">
          Address Line 2
          <input type="text" placeholder="Area, Locality, etc." style="width: 100%; padding: 8px; border: 1px solid var(--surface-border-gray-muted); border-radius: 4px; box-sizing: border-box; margin-top: 4px;" />
        </label>
      </div>
      <div style="display: flex; flex-direction: row; gap: 16px; margin-top: 16px;">
        <div style="flex: 1;">
          <label style="display: block; font-size: 14px; margin-bottom: 4px; color: var(--surface-text-gray-subtle);">
            Postal Code *
            <input type="text" placeholder="Zipcode" style="width: 100%; padding: 8px; border: 1px solid var(--surface-border-gray-muted); border-radius: 4px; box-sizing: border-box; margin-top: 4px;" />
          </label>
        </div>
        <div style="flex: 1;">
          <label style="display: block; font-size: 14px; margin-bottom: 4px; color: var(--surface-text-gray-subtle);">
            Country *
            <input type="text" placeholder="Country" style="width: 100%; padding: 8px; border: 1px solid var(--surface-border-gray-muted); border-radius: 4px; box-sizing: border-box; margin-top: 4px;" />
          </label>
        </div>
      </div>
      <div style="margin-top: 16px;">
        <label style="display: block; font-size: 14px; margin-bottom: 4px; color: var(--surface-text-gray-subtle);">
          Mobile Number (optional)
          <input type="text" placeholder="Enter mobile number" style="width: 100%; padding: 8px; border: 1px solid var(--surface-border-gray-muted); border-radius: 4px; box-sizing: border-box; margin-top: 4px;" />
        </label>
      </div>
    </CardBody>
    <CardFooter>
      <CardFooterLeading subtitle="Last updated on 20th Sep 2022" />
      <CardFooterTrailing
        actions={{
          primary: {
            text: 'Save Details',
            onClick: () => console.log('Saved'),
          },
          secondary: {
            text: 'Reset',
            onClick: () => console.log('Reset'),
          },
        }}
      />
    </CardFooter>
  </Card>
</Story>

<!-- Story 4: Card Without Padding -->
<Story name="Card Without Padding" asChild>
  <Card padding="spacing.0">
    <CardBody>
      <div style="display: flex; flex-direction: row;">
        <img
          width="300"
          height="auto"
          src="https://d6xcmfyh68wv8.cloudfront.net/assets/case-studies/common-card/pg_breathingroom.png"
          alt="Breathing Room"
          style="border-top-left-radius: 4px; border-bottom-left-radius: 4px; object-fit: cover;"
        />
        <div style="padding: 24px; display: flex; flex-direction: column;">
          <Heading size="large">Breathing Room</Heading>
          <Text marginTop="spacing.5">
            Popular in the startup ecosystem, BreathingRoom.co offers short-term workspaces
            conference rooms, training rooms, cabins & hotdesks to individuals and enterprises on
            an hourly & monthly basis. BreathingRoom is perfect for a wide range of professional
            needs like training sessions, recruitment drives, team offsites, and client meetings
            in addition to cost effective office space rentals; great for setting up remote
            offices. With a network of over 450 office spaces spread across Mumbai, Delhi,
            Bangalore, Pune, Hyderabad and Chennai, BreathingRoom offers convenient, flexible
            rental options that can be easily booked through the website or mobile app.
          </Text>
        </div>
      </div>
    </CardBody>
  </Card>
</Story>

<!-- Story 5: Card With Max Width -->
<Story name="Card With Max Width" asChild>
  <Card maxWidth="800px" padding="spacing.0">
    <CardBody>
      <div style="display: flex; flex-direction: row;">
        <img
          width="300"
          height="auto"
          src="https://d6xcmfyh68wv8.cloudfront.net/assets/case-studies/common-card/pg_breathingroom.png"
          alt="Breathing Room"
          style="border-top-left-radius: 4px; border-bottom-left-radius: 4px; object-fit: cover;"
        />
        <div style="padding: 24px; display: flex; flex-direction: column;">
          <Heading size="large">Breathing Room</Heading>
          <Text marginTop="spacing.5">
            Popular in the startup ecosystem, BreathingRoom.co offers short-term workspaces
            conference rooms, training rooms, cabins & hotdesks to individuals and enterprises on
            an hourly & monthly basis. BreathingRoom is perfect for a wide range of professional
            needs like training sessions, recruitment drives, team offsites, and client meetings
            in addition to cost effective office space rentals; great for setting up remote
            offices. With a network of over 450 office spaces spread across Mumbai, Delhi,
            Bangalore, Pune, Hyderabad and Chennai, BreathingRoom offers convenient, flexible
            rental options that can be easily booked through the website or mobile app.
          </Text>
        </div>
      </div>
    </CardBody>
  </Card>
</Story>

<!-- Story 6: Metric Card Variant -->
<Story name="Metric Card Variant" asChild>
  <Card
    maxWidth="500px"
    minWidth="300px"
    padding="spacing.5"
    size="medium"
  >
    <CardHeader showDivider={false}>
      <CardHeaderLeading
        title="Total Payment Volume"
        subtitle="Total Payment Volume for the current month"
      />
      <CardHeaderTrailing>
        {#snippet visual()}
          <CardHeaderBadge color="positive">New</CardHeaderBadge>
        {/snippet}
      </CardHeaderTrailing>
    </CardHeader>
    <CardBody>
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; flex-direction: column; justify-content: flex-end;">
          <div style="display: flex; flex-direction: row; gap: 8px; align-items: center;">
            <Amount
              value={1000}
              color="surface.text.gray.normal"
              weight="semibold"
              size="2xlarge"
              type="heading"
            />
            <div style="display: flex; flex-direction: row; gap: 4px; align-items: center; justify-content: center;">
              <SearchIcon color="interactive.icon.positive.normal" />
              <Text color="interactive.text.positive.normal">12</Text>
            </div>
          </div>
        </div>
        <div style="width: 100%; display: flex; align-items: center;">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 546 139"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.09"
              d="M32.9065 100.629L2 98.949V138.237H544V40.7617L510.041 42.2896C508.598 42.3545 507.171 42.6144 505.798 43.0623L475.74 52.867C473.114 53.7237 470.31 53.8858 467.603 53.3377L436.728 47.0865C435.977 46.9345 435.216 46.8366 434.451 46.7936L402.384 44.9901C400.455 44.8816 398.522 45.1234 396.68 45.7038L367.358 54.9386C364.72 55.7694 361.912 55.9023 359.207 55.3243L330.544 49.1985C328.34 48.7274 326.06 48.7274 323.856 49.1985L291.067 56.2061L257.144 68.0347C255.678 68.5458 254.146 68.8408 252.595 68.9106L222.608 70.2598C220.104 70.3724 217.609 69.8954 215.324 68.8671L192.115 58.4249C186.366 55.8383 179.634 56.8685 174.922 61.0558L150.475 82.7792C147.915 85.0541 144.692 86.4476 141.281 86.7545L113.756 89.2313C111.543 89.4305 109.313 89.1664 107.207 88.4558L81.6226 79.8226C76.9776 78.2552 71.8704 78.9037 67.7646 81.5823L42.5174 98.0533C39.669 99.9116 36.3025 100.814 32.9065 100.629Z"
              fill="#305EFF"
            />
            <path
              d="M2 98.949L32.9065 100.629C36.3025 100.814 39.669 99.9116 42.5174 98.0533L67.7646 81.5823C71.8704 78.9037 76.9776 78.2552 81.6226 79.8226L107.207 88.4558C109.313 89.1664 111.543 89.4305 113.756 89.2313L141.281 86.7545C144.692 86.4476 147.915 85.0541 150.475 82.7792L174.922 61.0558C179.634 56.8685 186.366 55.8383 192.115 58.4249L215.324 68.8671C217.609 69.8954 220.104 70.3724 222.608 70.2598L252.595 68.9106C254.146 68.8408 255.678 68.5458 257.144 68.0347L291.067 56.2061L323.856 49.1985C326.06 48.7274 328.34 48.7274 330.544 49.1985L359.207 55.3243C361.912 55.9023 364.72 55.7694 367.358 54.9386L396.679 45.7038C398.522 45.1234 400.455 44.8816 402.384 44.9901L434.451 46.7936C435.216 46.8366 435.977 46.9345 436.728 47.0865L467.603 53.3377C470.31 53.8858 473.114 53.7237 475.74 52.867L505.798 43.0623C507.171 42.6144 508.598 42.3545 510.041 42.2896L544 40.7617"
              stroke="#305EFF"
              stroke-width="3"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </div>
    </CardBody>
  </Card>
</Story>

<!-- Story 7: Card With Overflow -->
<Story name="Card With Overflow" asChild>
  <div style="display: flex; flex-direction: column; gap: 24px;">
    <Heading>Card with overflow="auto"</Heading>
    <Card height="200px" overflow="auto" maxWidth="400px">
      <CardHeader>
        <CardHeaderLeading title="Scrollable Content" />
      </CardHeader>
      <CardBody>
        <Text>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </Text>
        <Text marginTop="spacing.5">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
        </Text>
      </CardBody>
    </Card>

    <Heading>Card with overflow="hidden"</Heading>
    <Card height="200px" overflow="hidden" maxWidth="400px">
      <CardHeader>
        <CardHeaderLeading title="Hidden Overflow" />
      </CardHeader>
      <CardBody>
        <Text>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </Text>
      </CardBody>
    </Card>

    <Heading>Card with overflowY="scroll"</Heading>
    <Card height="200px" overflowY="scroll" maxWidth="400px">
      <CardHeader>
        <CardHeaderLeading title="Vertical Scroll Only" />
      </CardHeader>
      <CardBody>
        <Text>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </Text>
      </CardBody>
    </Card>
  </div>
</Story>

<!-- Story 8: Card Types — primary / secondary / theme treatments -->
<Story name="Card Types" asChild>
  <div style="display: flex; flex-direction: column; gap: 24px; background-color: var(--surface-background-gray-subtle); padding: var(--spacing-8);">
    <Card variant="primary" maxWidth="500px">
      <CardHeader showDivider={false}>
        <CardHeaderLeading
          title="Primary Card"
          subtitle="Elevated styling with surface.background.gray.intense background"
        />
      </CardHeader>
      <CardBody>
        <Text>variant="primary" uses gradients and drop shadow. backgroundColor is ignored.</Text>
      </CardBody>
    </Card>

    <Card variant="secondary" maxWidth="500px">
      <CardHeader showDivider={false}>
        <CardHeaderLeading
          title="Secondary Card"
          subtitle="Flat styling with surface.background.gray.moderate background"
        />
      </CardHeader>
      <CardBody>
        <Text>variant="secondary" is flat with no elevation. backgroundColor is ignored.</Text>
      </CardBody>
    </Card>

    <Card variant="theme" backgroundColor="surface.background.cloud.subtle" maxWidth="500px">
      <CardHeader showDivider={false}>
        <CardHeaderLeading
          title="Theme Card"
          subtitle="Elevated styling with surface.background.cloud.subtle background"
        />
      </CardHeader>
      <CardBody>
        <Text>variant="theme" matches primary elevation with a custom backgroundColor (cloud subtle here).</Text>
      </CardBody>
    </Card>
  </div>
</Story>

<!-- Story 9: Order Summary — order item with SKU image, details, and pricing -->
<Story name="Order Summary" asChild>
  <div style="background-color: var(--surface-background-gray-subtle); padding: var(--spacing-8);">
    <Card maxWidth="380px" size="medium">
      <CardHeader>
        <CardHeaderLeading title="Order summary" />
        <CardHeaderTrailing>
          {#snippet visual()}
            <CardHeaderIconButton
              icon={ChevronRightIcon}
              accessibilityLabel="View order summary"
              onClick={() => console.log('Order summary clicked')}
            />
          {/snippet}
        </CardHeaderTrailing>
      </CardHeader>
      <CardBody>
        <div style="display: flex; flex-direction: row; gap: var(--spacing-4); align-items: flex-start;">
          <img
            width="48"
            height="48"
            src="https://images.unsplash.com/photo-1545127398-14699f92334b?w=96&h=96&fit=crop"
            alt="boAt XP345 Headphones"
            style="flex-shrink: 0; border-radius: var(--border-radius-medium); object-fit: cover; background-color: var(--surface-background-gray-intense);"
          />
          <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: var(--spacing-1);">
            <Text weight="semibold" size="medium" color="surface.text.gray.normal">
              boAt XP345 Headphones
            </Text>
            <Text size="small" color="surface.text.gray.subtle">
              Qty.1 • Black • XL
            </Text>
          </div>
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: var(--spacing-1); flex-shrink: 0;">
            <Amount value={1149} fractionDigits={0} weight="semibold" size="large" />
            <Amount
              value={4660}
              fractionDigits={0}
              isStrikethrough
              color="surface.text.gray.subtle"
              size="small"
            />
          </div>
        </div>
      </CardBody>
    </Card>
  </div>
</Story>

<!-- Reusable renderers for the sectioned-variant showcase stories below. Defined at component
     top-level (not inside <Story>) so they aren't mistaken for Story snippet props. -->
{#snippet ticketCard(label: string, isSelected: boolean, isDisabled: boolean)}
  <TicketCard width="280px" {isSelected} {isDisabled}>
    <TicketCardBody>
      <div style="display: flex; flex-direction: column; gap: var(--spacing-2);">
        <Text weight="semibold">Razorpay Summit 2026</Text>
        <Text size="small" color="surface.text.gray.subtle">{label}</Text>
      </div>
    </TicketCardBody>
    <TicketCardFooter>
      <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;">
        <div style="display: flex; flex-direction: column;">
          <Text size="small" color="surface.text.gray.subtle">Seat</Text>
          <Text weight="semibold">A-24</Text>
        </div>
        <Amount value={4999} type="body" weight="semibold" />
      </div>
    </TicketCardFooter>
  </TicketCard>
{/snippet}

{#snippet infoCard(label: string, isSelected: boolean, isDisabled: boolean)}
  <InfoCard width="280px" {isSelected} {isDisabled}>
    <InfoCardBody>
      <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;">
        <Text weight="semibold">Razorpay Summit 2026</Text>
        <Text size="small" color="surface.text.gray.subtle">{label}</Text>
      </div>
    </InfoCardBody>
    <InfoCardFooter>
      <div style="display: flex; flex-direction: column; gap: var(--spacing-2);">
        <Text size="small" color="surface.text.gray.subtle">Venue</Text>
        <Text weight="semibold">Jio World Convention Centre, Mumbai</Text>
      </div>
    </InfoCardFooter>
  </InfoCard>
{/snippet}

<!-- Story 10: Ticket Card — two sections split by a scalloped, notched tear line.
     Compose with `TicketCardBody` and `TicketCardFooter`. -->
<Story name="Ticket Card" asChild>
  <div
    style="display: flex; flex-direction: row; gap: var(--spacing-7); flex-wrap: wrap; padding: var(--spacing-8); background-color: var(--surface-background-gray-subtle);"
  >
    {@render ticketCard('Default', false, false)}
    {@render ticketCard('Selected', true, false)}
    {@render ticketCard('Disabled', false, true)}
  </div>
</Story>

<!-- Story 11: Info Card — emphasized header over subtle body inside single rounded border.
     Compose with `InfoCardBody` and `InfoCardFooter`. -->
<Story name="Info Card" asChild>
  <div
    style="display: flex; flex-direction: row; gap: var(--spacing-7); flex-wrap: wrap; padding: var(--spacing-8); background-color: var(--surface-background-gray-subtle);"
  >
    {@render infoCard('Default', false, false)}
    {@render infoCard('Selected', true, false)}
    {@render infoCard('Disabled', false, true)}
  </div>
</Story>
