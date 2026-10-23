## Component Name

Avatar

## Description

Avatar shows a person or a business at a glance: their image, else their initials (from `name`), else a glyph (`UserIcon` by default). A circle is a person and a square a business or entity; it comes in five sizes (20 to 56px) and six tint colours, can carry an indicator dot at the top right and a trusted badge at the bottom right, and becomes a button with `onClick` or a link with `href`. `AvatarGroup` stacks avatars with an overlap and folds the ones past `maxCount` into a "+N" avatar.

## Important Constraints

- `name` gives the initials and names the avatar; give `alt` for an avatar with no name (a glyph only)
- A broken or still-loading image falls back to the initials or the glyph
- `icon` takes an icon source from `@razorpay/blade-svelte/icons`, never a component
- `topAddon` and `bottomAddon` are snippets drawn in a box Blade sizes and places per avatar size: fill it (`h-full w-full`)
- Inside an `AvatarGroup`, the group's `size` wins over each Avatar's
- `class` places the avatar (margin, flex item); its look is `size`, `variant`, `color` and `isSelected`

## Props

```typescript
type AvatarSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
type AvatarVariant = 'circle' | 'square';
type AvatarColor = 'neutral' | 'primary' | 'positive' | 'negative' | 'notice' | 'information';
type AvatarGroupDensity = 'compact' | 'normal' | 'comfortable';

interface AvatarProps {
  /** Initials come from it (two letters of one name, else first and last initials); it also names the avatar. */
  name?: string;
  /** The image; the initials or the glyph show until (and unless) it loads. */
  src?: string;
  /** Names the avatar (the image's alt). @default name */
  alt?: string;
  srcSet?: string;
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
  referrerPolicy?: ReferrerPolicy;
  /** The glyph when there is no name or image. @default UserIcon */
  icon?: IconSource;
  /** Makes the avatar a button, with the hover tint and the focus ring. */
  onClick?: (event: MouseEvent) => void;
  /** Makes the avatar a link, routed through `adapters.navigate`. */
  href?: string;
  target?: string;
  /** `noopener noreferrer` is added for `target="_blank"`. */
  rel?: string;
  /** At the top right: an indicator dot, 6–10px by size. */
  topAddon?: Snippet;
  /** At the bottom right: a trusted badge (an image) or a glyph, 8–20px by size. */
  bottomAddon?: Snippet;
  /** 20, 28, 36, 48 or 56px. Inside an AvatarGroup the group's size wins. @default 'medium' */
  size?: AvatarSize;
  /** `circle` for a person, `square` for a business or entity. @default 'circle' */
  variant?: AvatarVariant;
  /** The tint behind the initials or the glyph. @default 'neutral' */
  color?: AvatarColor;
  /** A 2px primary border. @default false */
  isSelected?: boolean;
  testID?: string;
  /** Placement only. */
  class?: string;
}

interface AvatarGroupProps {
  /** The Avatars. */
  children: Snippet;
  /** How many avatars show; the rest fold into a "+N" avatar. */
  maxCount?: number;
  /** Every avatar's size. @default 'medium' */
  size?: AvatarSize;
  /** The overlap: `compact` half an avatar, `normal` 16px (14px at xsmall), `comfortable` 8px. @default 'compact' */
  density?: AvatarGroupDensity;
  /** Names the group (`role="group"`). */
  accessibilityLabel?: string;
  /** Localized; names the "+N" avatar for a screen reader. @default (count) => `${count} more` */
  overflowLabel?: (count: number) => string;
  testID?: string;
  /** Placement only. */
  class?: string;
}
```

## Guidelines

- Pass `name` whenever you have one, even with `src`: it names the avatar and supplies initials if the image fails.
- Use `variant="square"` for businesses and merchants, with an `icon` such as `BuildingIcon` when there is no logo.
- Use `color` to tell people apart in a list or group; keep `neutral` for a lone avatar.
- Set `size` on the AvatarGroup, not on each Avatar inside it.
- Give an AvatarGroup an `accessibilityLabel` ("Reviewers", "Team").
- Don't draw initials or an image yourself inside a snippet: use `name` and `src`.
- Don't wrap an Avatar in your own `<button>` or `<a>`: use `onClick` or `href`.

## Examples

### Image, initials and glyph

```svelte
<script lang="ts">
  import { Avatar } from '@razorpay/blade-svelte/components';
  import { BuildingIcon } from '@razorpay/blade-svelte/icons';
</script>

<div class="flex flex-wrap items-center gap-blade-4">
  <Avatar name="Nitin Kumar" src="https://avatars.githubusercontent.com/u/46647141?v=4" />
  <Avatar name="Asha Rao" color="primary" size="large" />
  <Avatar variant="square" icon={BuildingIcon} color="information" alt="Business" />
  <Avatar alt="Guest" size="small" />
</div>
```

### Addons

```svelte
<script lang="ts">
  import { Avatar } from '@razorpay/blade-svelte/components';
</script>

{#snippet online()}
  <span class="h-full w-full rounded-max bg-interactive-positive-default"></span>
{/snippet}

<Avatar name="Dev Shah" size="large" topAddon={online} />
```

### Clickable and selected

```svelte
<script lang="ts">
  import { Avatar } from '@razorpay/blade-svelte/components';

  const people = ['Asha Rao', 'Dev Mehta', 'Ira Khan'];
  let selected = $state('Asha Rao');
</script>

<div class="flex items-center gap-blade-3">
  {#each people as person (person)}
    <Avatar name={person} isSelected={selected === person} onClick={() => (selected = person)} />
  {/each}
</div>
```

### A group with a "+N"

```svelte
<script lang="ts">
  import { Avatar, AvatarGroup } from '@razorpay/blade-svelte/components';

  const team = [
    { name: 'Asha Rao', color: 'primary' },
    { name: 'Dev Mehta', color: 'positive' },
    { name: 'Ira Khan', color: 'negative' },
    { name: 'Kabir Sen', color: 'information' },
    { name: 'Meera Iyer', color: 'notice' },
  ] as const;
</script>

<AvatarGroup size="small" density="normal" maxCount={3} accessibilityLabel="Reviewers">
  {#each team as person (person.name)}
    <Avatar name={person.name} color={person.color} />
  {/each}
</AvatarGroup>
```
