<script lang="ts">
  import { provideAdapters } from '../../adapters';
  import Link from '../../components/link/Link.svelte';
  import { chevronDown } from '../../components/icons';

  interface Props {
    href?: string;
    target?: '_self' | '_blank';
    rel?: string;
    isDisabled?: boolean;
    iconPosition?: 'leading' | 'trailing';
    withIcon?: boolean;
    color?: 'primary' | 'neutral' | 'positive' | 'negative';
    size?: 'xsmall' | 'small' | 'medium' | 'large';
    onClick?: (event: MouseEvent) => void;
    navigate?: (href: string, event: MouseEvent) => boolean;
  }

  let {
    href = '/card',
    target,
    rel,
    isDisabled,
    iconPosition,
    withIcon = false,
    color,
    size,
    onClick,
    navigate,
  }: Props = $props();

  // svelte-ignore state_referenced_locally
  provideAdapters({ navigate });
</script>

<!-- jsdom cannot navigate: the form of the click is what the tests read. -->
<div
  role="presentation"
  onclick={(event) => {
    document.body.dataset.prevented = String(event.defaultPrevented);
    event.preventDefault();
  }}
>
  <Link
    {href}
    {target}
    {rel}
    {isDisabled}
    {iconPosition}
    icon={withIcon ? chevronDown : undefined}
    {color}
    {size}
    {onClick}
    testID="link"
    class="ml-2"
  >
    Pay by card
  </Link>
</div>
