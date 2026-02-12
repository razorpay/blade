<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Card from './Card.svelte';

  const { Story } = defineMeta({
    title: 'Components/Card',
    component: Card,
    tags: ['autodocs'],
    argTypes: {
      backgroundColor: {
        control: 'select',
        options: [
          'surface.background.gray.intense',
          'surface.background.gray.moderate',
          'surface.background.gray.subtle',
        ],
      },
      borderRadius: {
        control: 'select',
        options: ['medium', 'large', 'xlarge'],
      },
      elevation: {
        control: 'select',
        options: ['none', 'lowRaised', 'midRaised', 'highRaised'],
      },
      padding: {
        control: 'radio',
        options: ['spacing.0', 'spacing.3', 'spacing.4', 'spacing.5', 'spacing.7'],
      },
    },
    args: {
      backgroundColor: 'surface.background.gray.intense',
      borderRadius: 'medium',
      elevation: 'lowRaised',
      padding: 'spacing.7',
    },
  });
</script>

<script lang="ts">
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
  import { CreditCardIcon, InfoIcon, CloseIcon, CheckIcon, SearchIcon } from '../Icons';
</script>

<!-- Story 1: Card Example -->
<Story name="Card Example" asChild>
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
</Story>

<!-- Story 2: Figma Example -->
<Story name="Figma Example" asChild>
  <Card>
    <CardHeader>
      <CardHeaderLeading
        title="Header Title"
        subtitle="Header Subtitle"
      >
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
  <Card elevation="highRaised" padding="spacing.0">
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
    backgroundColor="surface.background.gray.intense"
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
