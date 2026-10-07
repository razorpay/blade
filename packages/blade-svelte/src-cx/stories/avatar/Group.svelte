<script lang="ts">
  import { Avatar, AvatarGroup, type AvatarGroupStyleProps } from '../../index';

  interface Props {
    args: AvatarGroupStyleProps & { maxCount?: number };
  }

  let { args }: Props = $props();

  const TEAM = [
    { name: 'Asha Rao', color: 'primary' },
    { name: 'Dev Mehta', color: 'positive' },
    { name: 'Ira Khan', color: 'negative' },
    { name: 'Kabir Sen', color: 'information' },
    { name: 'Meera Iyer', color: 'notice' },
    { name: 'Rohan Das', color: 'neutral' },
    { name: 'Sara Ali', color: 'primary' },
  ] as const;
</script>

<AvatarGroup size={args.size} density={args.density} maxCount={args.maxCount} accessibilityLabel="Team">
  {#each TEAM as person (person.name)}
    <Avatar name={person.name} color={person.color} />
  {/each}
</AvatarGroup>
