<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import StepGroup from './StepGroup.svelte';

  const { Story } = defineMeta({
    title: 'Components/StepGroup',
    component: StepGroup,
    tags: ['autodocs'],
    args: {
      orientation: 'vertical',
      size: 'medium',
    },
    argTypes: {
      orientation: {
        control: 'select',
        options: ['vertical', 'horizontal'],
        description: 'Orientation of step group',
        table: { defaultValue: { summary: 'vertical' } },
      },
      size: {
        control: 'select',
        options: ['medium', 'large'],
        description: 'Size of step group',
        table: { defaultValue: { summary: 'medium' } },
      },
    },
  });
</script>

<script lang="ts">
  import StepItem from './StepItem.svelte';
  import StepItemIndicator from './StepItemIndicator.svelte';
  import StepItemIcon from './StepItemIcon.svelte';
  import Badge from '../Badge/Badge.svelte';
  import Button from '../Button/Button.svelte';
  import { UserIcon } from '../Icons/UserIcon';
  import { BuildingIcon } from '../Icons/BuildingIcon';
  import { CheckCircleIcon } from '../Icons/CheckCircleIcon';
  import { InfoIcon } from '../Icons/InfoIcon';
  import { HomeIcon } from '../Icons/HomeIcon';
  import { CreditCardIcon } from '../Icons/CreditCardIcon';

  // Interactive state for StepGroupInteractive
  let selectedIndex = $state(-1);

  const stepsSampleData = [
    {
      title: 'Introduction',
      timestamp: "Mon, 15th Oct'23 | 12:00pm",
      description: 'Introduction to Razorpay Payment Gateway',
    },
    {
      title: 'Personal Details',
      timestamp: "Mon, 16th Oct'23 | 12:00pm",
      description: 'Fill your Personal Details for onboarding',
    },
    {
      title: 'Business Details',
      timestamp: "Mon, 17th Oct'23 | 12:00pm",
      description: 'Fill your Business Details for onboarding',
      isDisabled: true,
    },
    {
      title: 'Complete Onboarding',
      timestamp: "Mon, 20th Oct'23 | 12:00pm",
      description: 'Complete your onboarding to start',
    },
  ] as const;
</script>

<!-- StepGroupDefault: Vertical medium static -->
<Story name="StepGroupDefault">
  <StepGroup orientation="vertical" size="medium">
    {#snippet children()}
      <StepItem
        title="Disputes Raised"
        timestamp="Thu, 11th Oct'23 | 12:00pm"
        stepProgress="full"
      >
        {#snippet marker()}
          <StepItemIndicator color="positive" />
        {/snippet}
      </StepItem>
      <StepItem
        title="Disputes Contested"
        timestamp="Mon, 15th Oct'23 | 12:00pm"
        description="Disputes contested for Rs 5000"
        stepProgress="full"
      >
        {#snippet marker()}
          <StepItemIndicator color="positive" />
        {/snippet}
      </StepItem>
      <StepItem
        title="Disputes Under Review"
        stepProgress="full"
      >
        {#snippet marker()}
          <StepItemIndicator color="positive" />
        {/snippet}
        {#snippet trailing()}
          <Badge color="positive" size="medium">Received by our team</Badge>
        {/snippet}
      </StepItem>
      <StepItem
        title="Needs Response"
        titleColor="feedback.text.notice.intense"
        timestamp="Respond latest by Tue, 23rd Oct'24 | 12:00pm"
        stepProgress="start"
      >
        {#snippet marker()}
          <StepItemIndicator color="notice" />
        {/snippet}
        {#snippet children()}
          <Button size="medium" variant="secondary">Submit Documents</Button>
        {/snippet}
      </StepItem>
      <StepItem
        title="Documents Sent to the Bank"
        description="Bank might take up to 3 months to review"
      >
        {#snippet trailing()}
          <Badge color="neutral" size="medium">Pending</Badge>
        {/snippet}
      </StepItem>
      <StepItem title="Decision from the Bank">
        {#snippet trailing()}
          <Badge color="neutral" size="medium">Pending</Badge>
        {/snippet}
      </StepItem>
    {/snippet}
  </StepGroup>
</Story>

<!-- StepGroupLarge: Vertical large static -->
<Story name="StepGroupLarge">
  <StepGroup orientation="vertical" size="large">
    {#snippet children()}
      <StepItem
        title="Disputes Raised"
        timestamp="Thu, 11th Oct'23 | 12:00pm"
        stepProgress="full"
      >
        {#snippet marker()}
          <StepItemIndicator color="positive" />
        {/snippet}
      </StepItem>
      <StepItem
        title="Disputes Contested"
        timestamp="Mon, 15th Oct'23 | 12:00pm"
        description="Disputes contested for Rs 5000"
        stepProgress="full"
      >
        {#snippet marker()}
          <StepItemIndicator color="positive" />
        {/snippet}
      </StepItem>
      <StepItem
        title="Disputes Under Review"
        stepProgress="full"
      >
        {#snippet marker()}
          <StepItemIndicator color="positive" />
        {/snippet}
        {#snippet trailing()}
          <Badge color="positive" size="large">Received by our team</Badge>
        {/snippet}
      </StepItem>
      <StepItem
        title="Needs Response"
        titleColor="feedback.text.notice.intense"
        timestamp="Respond latest by Tue, 23rd Oct'24 | 12:00pm"
        stepProgress="start"
      >
        {#snippet marker()}
          <StepItemIndicator color="notice" />
        {/snippet}
      </StepItem>
      <StepItem title="Documents Sent to the Bank" description="Bank might take up to 3 months to review">
        {#snippet trailing()}
          <Badge color="neutral" size="large">Pending</Badge>
        {/snippet}
      </StepItem>
      <StepItem title="Decision from the Bank">
        {#snippet trailing()}
          <Badge color="neutral" size="large">Pending</Badge>
        {/snippet}
      </StepItem>
    {/snippet}
  </StepGroup>
</Story>

<!-- StepGroupInteractive: Clickable vertical items -->
<Story name="StepGroupInteractive">
  <StepGroup orientation="vertical" size="medium">
    {#snippet children()}
      {#each stepsSampleData as stepInfo, index}
        <StepItem
          title={stepInfo.title}
          timestamp={stepInfo.timestamp}
          description={stepInfo.description}
          isDisabled={'isDisabled' in stepInfo ? stepInfo.isDisabled : false}
          isSelected={selectedIndex === index}
          stepProgress={index === selectedIndex ? 'start' : index < selectedIndex ? 'full' : 'none'}
          onClick={() => { selectedIndex = index; }}
        >
          {#snippet marker()}
            <StepItemIndicator color={selectedIndex === index ? 'primary' : 'neutral'} />
          {/snippet}
        </StepItem>
      {/each}
    {/snippet}
  </StepGroup>
</Story>

<!-- StepGroupInteractiveHorizontal: Clickable horizontal items -->
<Story name="StepGroupInteractiveHorizontal">
  {#snippet children({ args })}
    <StepGroup orientation="horizontal" size={args.size ?? 'medium'}>
      {#snippet children()}
        {#each stepsSampleData as stepInfo, index}
          <StepItem
            title={stepInfo.title}
            isDisabled={'isDisabled' in stepInfo ? stepInfo.isDisabled : false}
            isSelected={selectedIndex === index}
            stepProgress={index === selectedIndex ? 'start' : index < selectedIndex ? 'full' : 'none'}
            onClick={() => { selectedIndex = index; }}
          >
            {#snippet marker()}
              <StepItemIndicator color={selectedIndex === index ? 'primary' : 'neutral'} />
            {/snippet}
          </StepItem>
        {/each}
      {/snippet}
    </StepGroup>
  {/snippet}
</Story>

<!-- StepGroupNested: Nested StepGroup components -->
<Story name="StepGroupNested">
  <StepGroup orientation="vertical" size="medium">
    {#snippet children()}
      <StepItem
        title="Disputes Raised"
        timestamp="Thu, 11th Oct'23 | 12:00pm"
        stepProgress="full"
      >
        {#snippet marker()}
          <StepItemIndicator color="positive" />
        {/snippet}
      </StepItem>
      <StepItem
        title="Disputes Under Review"
        stepProgress="full"
      >
        {#snippet marker()}
          <StepItemIndicator color="positive" />
        {/snippet}
        {#snippet trailing()}
          <Badge color="positive" size="medium">Received by our team</Badge>
        {/snippet}
      </StepItem>
      <!-- Nested StepGroup -->
      <StepGroup>
        {#snippet children()}
          <StepItem
            title="Review from Razorpay Team"
            timestamp="Fri, 12th Oct'23 | 12:00pm"
            description="The dispute is reviewed by Razorpay team"
            stepProgress="full"
          >
            {#snippet marker()}
              <StepItemIcon icon={HomeIcon} color="positive" />
            {/snippet}
          </StepItem>
        {/snippet}
      </StepGroup>
      <StepItem
        title="Needs Response"
        timestamp="Respond latest by Tue, 23rd Oct'24 | 12:00pm"
        stepProgress="start"
      >
        {#snippet marker()}
          <StepItemIndicator color="positive" />
        {/snippet}
      </StepItem>
      <!-- Second nested StepGroup -->
      <StepGroup>
        {#snippet children()}
          <StepItem title="Personal Documents Submission">
            {#snippet marker()}
              <StepItemIndicator color="positive" />
            {/snippet}
          </StepItem>
          <StepItem
            title="Company Documents Submission"
            titleColor="feedback.text.notice.intense"
          >
            {#snippet marker()}
              <StepItemIndicator color="notice" />
            {/snippet}
            {#snippet children()}
              <Button size="medium" variant="secondary">Submit Documents</Button>
            {/snippet}
          </StepItem>
          <StepItem title="Documents Approval">
            {#snippet trailing()}
              <Badge color="neutral" size="medium">Pending</Badge>
            {/snippet}
          </StepItem>
        {/snippet}
      </StepGroup>
      <StepItem title="Decision from the Bank">
        {#snippet trailing()}
          <Badge color="neutral" size="medium">Pending</Badge>
        {/snippet}
      </StepItem>
    {/snippet}
  </StepGroup>
</Story>

<!-- StepGroupWithIcons: Using StepItemIcon -->
<Story name="StepGroupWithIcons">
  <StepGroup orientation="vertical" size="medium">
    {#snippet children()}
      <StepItem
        title="Introduction"
        timestamp="Thu, 11th Oct'23 | 12:00pm"
        stepProgress="full"
      >
        {#snippet marker()}
          <StepItemIcon icon={CreditCardIcon} color="positive" />
        {/snippet}
      </StepItem>
      <StepItem
        title="Personal Details"
        timestamp="Mon, 15th Oct'23 | 12:00pm"
        description="Your Personal Details for onboarding"
        stepProgress="full"
      >
        {#snippet marker()}
          <StepItemIcon icon={UserIcon} color="positive" />
        {/snippet}
      </StepItem>
      <StepItem
        title="Business Details"
        stepProgress="full"
      >
        {#snippet marker()}
          <StepItemIcon icon={BuildingIcon} color="positive" />
        {/snippet}
        {#snippet trailing()}
          <Badge color="positive" size="medium">Received by our team</Badge>
        {/snippet}
      </StepItem>
      <StepItem
        title="Needs Response"
        timestamp="Respond latest by Tue, 23rd Oct'24 | 12:00pm"
        stepProgress="start"
      >
        {#snippet marker()}
          <StepItemIcon icon={InfoIcon} color="notice" />
        {/snippet}
      </StepItem>
      <StepItem title="Complete Onboarding">
        {#snippet marker()}
          <StepItemIcon icon={CheckCircleIcon} color="neutral" />
        {/snippet}
        {#snippet trailing()}
          <Badge color="neutral" size="medium">Pending</Badge>
        {/snippet}
      </StepItem>
    {/snippet}
  </StepGroup>
</Story>

<!-- CollapsibleStepGroup: Stub — Collapsible component not yet migrated to Svelte -->
<Story name="CollapsibleStepGroup">
  <!-- TODO: Implement once Collapsible is migrated to Svelte.
    In React, this story wraps StepItem children in <Collapsible><CollapsibleBody>...
    so that nested steps can be expanded/collapsed interactively.
    Only supported in vertical orientation.
  -->
  <div style="padding: 16px; border: 1px dashed #ccc; border-radius: 8px; color: #999;">
    CollapsibleStepGroup — pending Collapsible migration to Svelte
  </div>
</Story>

<!-- StepGroupShowcase: Comprehensive demo with multiple states -->
<Story name="StepGroupShowcase">
  <div style="display: flex; gap: 32px; flex-wrap: wrap;">
    <!-- Vertical -->
    <StepGroup orientation="vertical" size="medium">
      {#snippet children()}
        <StepItem
          title="Introduction"
          timestamp="Thu, 11th Oct'23 | 12:00pm"
          stepProgress="full"
        >
          {#snippet marker()}
            <StepItemIcon icon={CreditCardIcon} color="positive" />
          {/snippet}
        </StepItem>
        <StepItem
          title="Personal Details"
          timestamp="Mon, 15th Oct'23 | 12:00pm"
          description="Fill your Personal Details for onboarding"
          stepProgress="full"
        >
          {#snippet marker()}
            <StepItemIcon icon={UserIcon} color="positive" />
          {/snippet}
        </StepItem>
        <StepItem
          title="Business Details"
          stepProgress="start"
        >
          {#snippet marker()}
            <StepItemIndicator color="notice" />
          {/snippet}
          {#snippet trailing()}
            <Badge color="notice" size="medium">In Progress</Badge>
          {/snippet}
        </StepItem>
        <StepItem title="Complete Onboarding" isDisabled={true}>
          {#snippet marker()}
            <StepItemIndicator color="neutral" />
          {/snippet}
          {#snippet trailing()}
            <Badge color="neutral" size="medium">Pending</Badge>
          {/snippet}
        </StepItem>
      {/snippet}
    </StepGroup>

    <!-- Horizontal -->
    <StepGroup orientation="horizontal" size="medium">
      {#snippet children()}
        <StepItem title="Step 1" stepProgress="full">
          {#snippet marker()}
            <StepItemIndicator color="positive" />
          {/snippet}
        </StepItem>
        <StepItem title="Step 2" stepProgress="start">
          {#snippet marker()}
            <StepItemIndicator color="notice" />
          {/snippet}
        </StepItem>
        <StepItem title="Step 3">
          {#snippet marker()}
            <StepItemIndicator color="neutral" />
          {/snippet}
        </StepItem>
      {/snippet}
    </StepGroup>
  </div>
</Story>

<!-- Step Item Playground -->
<Story name="Step Item Playground">
  <StepGroup orientation="vertical" size="medium">
    {#snippet children()}
      <StepItem
        title="First Item"
        description="A test item to show how first item looks like"
      />
      <StepItem
        title="Playground Item"
        timestamp="Mon, 15th Oct'23 | 12:00pm"
        description="Customize this item via story controls"
        stepProgress="start"
      >
        {#snippet marker()}
          <StepItemIndicator color="primary" />
        {/snippet}
        {#snippet trailing()}
          <Badge color="primary" size="medium">Active</Badge>
        {/snippet}
      </StepItem>
      <StepItem
        title="Last Item"
        description="A test item to show how last item looks like"
      />
    {/snippet}
  </StepGroup>
</Story>
