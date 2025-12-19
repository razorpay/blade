<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  
  const { Story } = defineMeta({
    title: 'Link',
  });
</script>

<script>
  import Link from './Link.svelte';
</script>

<Story name="Link">
  <Link 
    href="https://github.com/razorpay/blade"
    rel="noreferrer noopener"
    target="_blank"
    variant="anchor"
    size="large"
  >
    Learn more
  </Link>
</Story>

<Story name="Link Button">
  <Link 
    variant="button"
    onClick={() => alert('clicked')}
  >
    Link Button
  </Link>
</Story>

<Story name="Link With Colors">
  <Link 
    variant="anchor"
    size="large"
    color="positive"
  >
    Positive Link
  </Link>
</Story>

<Story name="Link Button - Disabled">
  <Link 
    variant="button"
    isDisabled={true}
    onClick={() => alert('clicked')}
  >
    Disabled Link Button
  </Link>
</Story>

<Story name="Link with Size">
  <Link 
    variant="button"
    onClick={() => alert('clicked')}
    size="large"
  >
    Large Link Button
  </Link>
</Story>

