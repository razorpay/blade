<script lang="ts">
  import { Chip, ChipGroup } from '../../index';
  import { BankIcon, CreditCardIcon, PhoneIcon } from '../../icons';
</script>

<div class="flex flex-col gap-4">
  <ChipGroup label="With an icon" selectionType="multiple" value={['upi']}>
    <Chip value="upi" leading={PhoneIcon}>UPI</Chip>
    <Chip value="card" leading={CreditCardIcon}>Cards</Chip>
    <Chip value="bank" leading={BankIcon}>Netbanking</Chip>
  </ChipGroup>
  <ChipGroup accessibilityLabel="Icon only" value="card">
    <Chip value="upi" leading={PhoneIcon} accessibilityLabel="UPI" />
    <Chip value="card" leading={CreditCardIcon} accessibilityLabel="Cards" />
    <Chip value="bank" leading={BankIcon} accessibilityLabel="Netbanking" />
  </ChipGroup>
</div>
