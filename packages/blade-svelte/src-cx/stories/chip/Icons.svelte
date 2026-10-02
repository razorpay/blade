<script lang="ts">
  import { Chip, ChipGroup, icons } from '../../index';
</script>

<div class="flex flex-col gap-4">
  <ChipGroup label="With an icon" selectionType="multiple" value={['upi']}>
    <Chip value="upi" icon={icons.phone}>UPI</Chip>
    <Chip value="card" icon={icons.card}>Cards</Chip>
    <Chip value="bank" icon={icons.bank}>Netbanking</Chip>
  </ChipGroup>
  <ChipGroup accessibilityLabel="Icon only" value="card">
    <Chip value="upi" icon={icons.phone} />
    <Chip value="card" icon={icons.card} />
    <Chip value="bank" icon={icons.bank} />
  </ChipGroup>
</div>
