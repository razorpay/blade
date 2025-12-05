<script lang="ts">
  import Button from './components/Button/Button.svelte'
  import Link from './components/Link/Link.svelte'
  import ThemeSwitcher from './ThemeSwitcher.svelte'
  import Text from './components/Typography/Text/Text.svelte';
  import Heading from './components/Typography/Heading/Heading.svelte';
  import Code from './components/Typography/Code/Code.svelte';
  
  let isLoading = $state(false);
  let isLoading2 = $state(false);
  
  function handleClick(): void {
    alert('Button clicked!')
  }

  function handleLinkClick(event: MouseEvent): void {
    console.log('Link clicked!', event)
  }

  function handleLoadingClick(): void {
    isLoading = true;
    // Simulate async operation
    setTimeout(() => {
      isLoading = false;
    }, 2000);
  }

  function handleLoadingClick2(): void {
    isLoading2 = true;
    // Simulate async operation
    setTimeout(() => {
      isLoading2 = false;
    }, 2000);
  }
</script>

<main>
  <ThemeSwitcher />
  <div class="component-container">
    <Heading
      as='h2'
      color='surface.text.primary.normal'
      weight='semibold'
      size='xlarge'
    >
      Button Component
    </Heading>
    
    <Heading as='h3' color='surface.text.gray.normal' weight='semibold' size='medium'>
      Default Button
    </Heading>

    <Button size='large' variant='primary'>Click Me</Button>

    <Heading as='h3' color='surface.text.gray.normal' weight='semibold' size='medium'>
      Button Variants
    </Heading>

    <div class="btn-row">
      <Heading as='h4' color='surface.text.gray.normal' marginRight='spacing.4' size='small'>
        Primary
      </Heading>
      <div class="btn-col">
        <div>
          <Text>Primary</Text>
        </div>
        <div>
          <Button size='large' variant='primary'>Click Me</Button>
          <Button size='large' marginLeft='spacing.4' isDisabled={true} variant='primary'>Click Me</Button>
        </div>
      </div>
      <div class="btn-col">
        <div>
          <Text>Secondary</Text>
        </div>
        <div>
          <Button size='large' variant='secondary'>Click Me</Button>
          <Button size='large' marginLeft='spacing.4' isDisabled={true} variant='secondary'>Click Me</Button>
        </div>
      </div>
      <div class="btn-col">
        <div>
          <Text>Tertiary</Text>
        </div>
        <div>
          <Button size='large' variant='tertiary'>Click Me</Button>
          <Button size='large' marginLeft='spacing.4' isDisabled={true} variant='tertiary'>Click Me</Button>
        </div>
      </div>
    </div>
    <div class="btn-row">
      <Heading as='h4' color='surface.text.gray.normal' marginRight='spacing.4' size='small'>
        Positive
      </Heading>
      <div class="btn-col">
        <div>
          <Text>Primary</Text>
        </div>
        <div>
          <Button color="positive" size='large' variant='primary'>Click Me</Button>
          <Button color="positive" size='large' marginLeft='spacing.4' isDisabled={true} variant='primary'>Click Me</Button>
        </div>
      </div>
      <div class="btn-col">
        <div>
          <Text>Secondary</Text>
        </div>
        <div>
          <Button color="positive" size='large' variant='secondary'>Click Me</Button>
          <Button  color="positive" size='large' marginLeft='spacing.4' isDisabled={true} variant='secondary'>Click Me</Button>
        </div>
      </div>
    </div>

    <div class="btn-row btn-row-white">
      <Heading as='h4' color='surface.text.staticWhite.normal' marginRight='spacing.4' size='small'>
        White
      </Heading>
      <div class="btn-col">
        <div>
          <Text color='surface.text.staticWhite.normal'>Primary</Text>
        </div>
        <div>
          <Button color="white" size='large' variant='primary'>Click Me</Button>
          <Button color="white" size='large' marginLeft='spacing.4' isDisabled={true} variant='primary'>Click Me</Button>
        </div>
      </div>
      <div class="btn-col">
        <div>
          <Text color='surface.text.staticWhite.normal'>Secondary</Text>
        </div>
        <div>
          <Button color="white" size='large' variant='secondary'>Click Me</Button>
          <Button  color="white" size='large' marginLeft='spacing.4' isDisabled={true} variant='secondary'>Click Me</Button>
        </div>
      </div>
    </div>

    <div class="btn-row">
      <Heading as='h4' color='surface.text.gray.normal' marginRight='spacing.4' size='small'>
        Negative
      </Heading>
      <div class="btn-col">
        <div>
          <Text>Primary</Text>
        </div>
        <div>
          <Button color="negative" size='large' variant='primary'>Click Me</Button>
          <Button color="negative" size='large' marginLeft='spacing.4' isDisabled={true} variant='primary'>Click Me</Button>
        </div>
      </div>
      <div class="btn-col">
        <div>
          <Text>Secondary</Text>
        </div>
        <div>
          <Button color="negative" size='large' variant='secondary'>Click Me</Button>
          <Button  color="negative" size='large' marginLeft='spacing.4' isDisabled={true} variant='secondary'>Click Me</Button>
        </div>
      </div>
    </div>

    <Heading as='h3' color='surface.text.gray.normal' weight='semibold' size='medium'>
      Button Loading State
    </Heading>

    <div class="btn-row">
      <Heading as='h4' color='surface.text.gray.normal' marginRight='spacing.4' size='small'>
        Loading Examples
      </Heading>
      <div class="btn-col">
        <div>
          <Text>Primary Loading</Text>
        </div>
        <div>
          <Button size='large' variant='primary' isLoading={true}>Loading...</Button>
          <Button size='large' marginLeft='spacing.4' variant='primary' isLoading={isLoading} onClick={handleLoadingClick}>
            {isLoading ? 'Loading...' : 'Click to Load'}
          </Button>
        </div>
      </div>
      <div class="btn-col">
        <div>
          <Text>Secondary Loading</Text>
        </div>
        <div>
          <Button size='large' variant='secondary' isLoading={true}>Loading...</Button>
          <Button size='large' marginLeft='spacing.4' variant='secondary' isLoading={isLoading2} onClick={handleLoadingClick2}>
            {isLoading2 ? 'Loading...' : 'Click to Load'}
          </Button>
        </div>
      </div>
    </div>

    <div class="btn-row">
      <Heading as='h4' color='surface.text.gray.normal' marginRight='spacing.4' size='small'>
        Loading Sizes
      </Heading>
      <div class="btn-col">
        <div>
          <Text>All Sizes</Text>
        </div>
        <div style="display: flex; align-items: center; gap: var(--spacing-4); flex-wrap: wrap;">
          <Button size='xsmall' variant='primary' isLoading={true}>Pay Now</Button>
          <Button size='small' variant='primary' isLoading={true}>Pay Now</Button>
          <Button size='medium' variant='primary' isLoading={true}>Pay Now</Button>
          <Button size='large' variant='primary' isLoading={true}>Pay Now</Button>
        </div>
      </div>
    </div>

    <div class="btn-row">
      <Heading as='h4' color='surface.text.gray.normal' marginRight='spacing.4' size='small'>
        Loading Colors
      </Heading>
      <div class="btn-col">
        <div>
          <Text>Color Variants</Text>
        </div>
        <div style="display: flex; align-items: center; gap: var(--spacing-4); flex-wrap: wrap;">
          <Button size='large' variant='primary' color='primary' isLoading={true}>Pay Now</Button>
          <Button size='large' variant='primary' color='positive' isLoading={true}>Pay Now</Button>
          <Button size='large' variant='primary' color='negative' isLoading={true}>Pay Now</Button>
          <Button size='large' variant='secondary' color='primary' isLoading={true}>Pay Now</Button>
        </div>
      </div>
    </div>

    <Heading
      as='h2'
      color='surface.text.gray.normal'
      weight='semibold'
      size='medium'
    >
      Link Component - Anchor Variant
    </Heading>
    <div class="link-examples">
      <Link variant="anchor" href="https://razorpay.com" target="_blank">
        External Link
      </Link>
      <Link variant="anchor" href="/internal" color="primary">
        Primary Link
      </Link>
      <Link variant="anchor" href="#neutral" color="neutral">
        Neutral Link
      </Link>
      <Link variant="anchor" href="#positive" color="positive">
        Positive Link
      </Link>
      <Link variant="anchor" href="#negative" color="negative">
        Negative Link
      </Link>
    </div>

    <Heading
      as='h2'
      color='surface.text.gray.normal'
      weight='semibold'
      size='medium'
    >
      Link Component - Button Variant
    </Heading>
    <div class="link-examples">
      <Link variant="button" onClick={handleLinkClick}>
        Button Link
      </Link>
      <Link variant="button" onClick={handleLinkClick} isDisabled={true}>
        Disabled Button Link
      </Link>
      <Link variant="button" onClick={handleLinkClick} color="neutral">
        Neutral Button Link
      </Link>
    </div>

    <Heading
      as='h2'
      color='surface.text.gray.normal'
      weight='semibold'
      size='medium'
    >
      Link Component - Sizes
    </Heading>
    
    <div class="link-examples">
      <Link variant="anchor" href="#xsmall" size="xsmall">XSmall Link</Link>
      <Link variant="anchor" href="#small" size="small">Small Link</Link>
      <Link variant="anchor" href="#medium" size="medium">Medium Link</Link>
      <Link variant="anchor" href="#large" size="large">Large Link</Link>
    </div>

    <Heading
      as='h2'
      color='surface.text.gray.normal'
      weight='semibold'
      size='medium'
    >
      Text Component - Body Variant
    </Heading>
    <div class="text-examples">
      <Text variant="body" size="xsmall">Body text xsmall</Text>
      <Text variant="body" size="small">Body text small</Text>
      <Text variant="body" size="medium">Body text medium</Text>
      <Text variant="body" size="large">Body text large</Text>
    </div>

    <Heading
      as='h2'
      color='surface.text.gray.normal'
      weight='semibold'
      size='medium'
    >
      Text Component - Caption Variant
    </Heading>
    <div class="text-examples">
      <Text variant="caption" size="small">Caption text small</Text>
      <Text variant="caption" size="medium">Caption text medium</Text>
    </div>

    <Heading
    as='h2'
    color='surface.text.gray.normal'
    weight='semibold'
    size='medium'
  >
    Text Component - Weights
  </Heading>
    <div class="text-examples">
      <Text variant="body" size="medium" weight="regular">Regular weight text</Text>
      <Text variant="body" size="medium" weight="medium">Medium weight text</Text>
      <Text variant="body" size="medium" weight="semibold">Semibold weight text</Text>
    </div>

    <Heading
    as='h2'
    color='surface.text.gray.normal'
    weight='semibold'
    size='medium'
  >
    Text Component - Colors
  </Heading>
    <div class="text-examples">
      <Text variant="body" size="medium" color="interactive.text.primary.normal">Primary color text</Text>
      <Text variant="body" size="medium" color="surface.text.gray.normal">Normal gray text</Text>
      <Text variant="body" size="medium" color="interactive.text.positive.subtle">Positive color text</Text>
      <Text variant="body" size="medium" color="interactive.text.negative.normal">Negative color text</Text>
    </div>

    <Heading
      as='h2'
      color='surface.text.gray.normal'
      weight='semibold'
      size='medium'
    >
      Text Component - As HTML Element Variant
    </Heading>
    <div class="text-examples">
      <Text variant="body" marginY='spacing.6' size="medium" as={'p' as const}>Paragraph element</Text>
      <Text variant="body" size="medium" as={'span' as const}>Span element</Text>
      <Text variant="body" size="medium" as={'div' as const}>Div element</Text>
    </div>

    <Heading
      as='h2'
      color='surface.text.gray.normal'
      weight='semibold'
      size='medium'
    >
      Text Component - Inline Highlighted Text
    </Heading>
    <Text
      as="p"
      size="medium"
      variant="body"
      weight="regular"
    >
      Power your{' '}
      <Text
        as="span"
        color="surface.text.primary.normal"
        size="medium"
        variant="body"
        weight="semibold"
      >
        finance
      </Text>
      , grow your{' '}
      <Text
        as="span"
        size="medium"
        variant="body"
        weight="semibold"
      >
        business
      </Text>
    </Text>

    <Heading
      as='h2'
      color='surface.text.gray.normal'
      weight='semibold'
      size='medium'
    >
      Code Component
    </Heading>
    
      <Text size="medium">
        Lorem ipsum normal text{' '}
        <Code
          isHighlighted
          size="medium"
          weight="regular"
        >
          SENTRY_AUTH_TOKEN
        </Code>
        {' '}component
      </Text>
      <Text size="small">
        Lorem ipsum normal text{' '}
        <Code
          isHighlighted
          size="small"
          weight="regular"
        >
          SENTRY_AUTH_TOKEN
        </Code>
        {' '}component
      </Text>
    
  <Text size="medium">
    Lorem ipsum normal text{' '}
    <Code
      color="interactive.text.positive.subtle"
      size="medium"
      weight="bold"
    >
      SENTRY_AUTH_TOKEN
    </Code>
    {' '}component
  </Text>
  <Text size="small">
    Lorem ipsum normal text{' '}
    <Code
      color="interactive.text.positive.subtle"
      size="small"
      weight="bold"
    >
      SENTRY_AUTH_TOKEN
    </Code>
    {' '}component
  </Text>
  </div>
</main>

<style>
  main {
    padding: 2rem;
    text-align: center;
    background-color: var(--surface-background-gray-intense);
    min-height: 100%;
  }

  .component-container {
    padding: var(--spacing-4);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-6);
    align-items: flex-start;
  }

  .link-examples {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
    align-items: flex-start;
  }

  .btn-row {
    display: flex;
    align-items: center;
  }

  .btn-col {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: 12px;
  }

  :global(body[data-theme='dark']) .btn-row-white {
    background-color: var(--surface-background-gray-moderate);
  }

  :global(body:not([data-theme])) .btn-row-white {
    background-color: rgb(20, 61, 82);
  }

</style>
