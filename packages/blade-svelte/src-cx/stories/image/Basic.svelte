<script lang="ts">
  import {
    Icon,
    Image,
    Text,
    type ImageStyleProps,
  } from '../../index';
  import { BankIcon } from '../../icons';

  interface Props {
    args: ImageStyleProps & { alt?: string };
  }

  let { args }: Props = $props();

  const alt = $derived(args.alt ?? 'HDFC Bank');

  const LOGO =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#0b3a82"/><path d="M8 8h16v16H8z" fill="#fff"/><path d="M13 13h6v6h-6z" fill="#e11"/></svg>';

  // Stands in for `import('./logos/hdfc.svg?raw')`.
  const lazy = new Promise<string>((resolve) => {
    setTimeout(() => resolve(LOGO), 1500);
  });
</script>

<div class="flex items-end gap-6">
  <div class="flex flex-col items-center gap-1">
    <Image src={LOGO} {alt} shape={args.shape} fit={args.fit} class="w-10 h-10" />
    <Text size="small" color="muted">markup</Text>
  </div>
  <div class="flex flex-col items-center gap-1">
    <Image
      src={lazy}
      {alt}
      shape={args.shape}
      fit={args.fit}
      isPendingShown
      class="w-10 h-10"
    />
    <Text size="small" color="muted">promised</Text>
  </div>
  <div class="flex flex-col items-center gap-1">
    <Image
      src="/no-such-logo.png"
      {alt}
      shape={args.shape}
      fit={args.fit}
      class="w-10 h-10"
    />
    <Text size="small" color="muted">broken → initial</Text>
  </div>
  <div class="flex flex-col items-center gap-1">
    <Image
      src={undefined}
      {alt}
      shape={args.shape}
      fit={args.fit}
      class="w-10 h-10"
    >
      {#snippet fallback()}<Icon source={BankIcon} />{/snippet}
    </Image>
    <Text size="small" color="muted">own fallback</Text>
  </div>
</div>
