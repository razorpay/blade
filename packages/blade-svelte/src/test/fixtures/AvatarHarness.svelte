<script lang="ts">
  import Avatar from '../../components/avatar/Avatar.svelte';
  import AvatarGroup from '../../components/avatar/AvatarGroup.svelte';

  interface Props {
    maxCount?: number;
    onClick?: () => void;
  }

  let { maxCount, onClick }: Props = $props();
  const people = ['Asha Rao', 'Dev Mehta', 'Ira Khan', 'Kabir Sen', 'Meera Iyer'];
</script>

<Avatar name="Nitin Kumar" testID="plain" />
<Avatar name="Razorpay" variant="square" size="large" color="primary" isSelected testID="square" />
<Avatar testID="glyph" />
<Avatar name="Clickable" {onClick} testID="button" />
<Avatar name="Profile" href="/me" testID="link" />
<Avatar name="With image" src="/a.png" testID="image" />
<Avatar name="Addons" testID="addons">
  {#snippet topAddon()}<span data-testid="dot"></span>{/snippet}
  {#snippet bottomAddon()}<span data-testid="badge"></span>{/snippet}
</Avatar>

<AvatarGroup size="small" density="normal" {maxCount} accessibilityLabel="Team" testID="group">
  {#each people as person (person)}
    <Avatar name={person} size="xlarge" testID="member-{person.split(' ')[0].toLowerCase()}" />
  {/each}
</AvatarGroup>
