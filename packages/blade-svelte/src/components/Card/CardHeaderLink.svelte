<script lang="ts">
  import type { Snippet, Component } from 'svelte';
  import Link from '../Link/Link.svelte';
  import { useCardContext } from './CardContext';
  import type { IconProps } from '../Icons/types';

  type IconComponent = Component<IconProps>;

  // Verify inside Card
  useCardContext('CardHeaderLink');

  let { ...props }: {
    children?: Snippet | string;
    href?: string;
    target?: string;
    rel?: string;
    icon?: IconComponent;
    iconPosition?: 'left' | 'right';
    color?: 'primary' | 'white' | 'neutral' | 'negative' | 'positive';
    isDisabled?: boolean;
    onClick?: (event: MouseEvent) => void;
    size?: 'small' | 'medium' | 'large';
    variant?: 'anchor' | 'button';
    testID?: string;
    [key: `data-analytics-${string}`]: string;
  } = $props();
</script>

<Link {...props} />
