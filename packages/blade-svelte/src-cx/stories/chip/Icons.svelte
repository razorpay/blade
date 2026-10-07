<script lang="ts">
  import { Chip, ChipGroup } from '../../index';
  import { BankIcon, CreditCardIcon, PhoneIcon } from '../../icons';
</script>

<div class="flex flex-col gap-4">
  <ChipGroup label="With an icon" selectionType="multiple" value={['upi']}>
    <Chip value="upi" icon={PhoneIcon}>UPI</Chip>
    <Chip value="card" icon={CreditCardIcon}>Cards</Chip>
    <Chip value="bank" icon={BankIcon}>Netbanking</Chip>
  </ChipGroup>
  <ChipGroup accessibilityLabel="Icon only" value="card">
    <Chip value="upi" icon={PhoneIcon} />
    <Chip value="card" icon={CreditCardIcon} />
    <Chip value="bank" icon={BankIcon} />
  </ChipGroup>
</div>
