# Available Icons in Blade Svelte

`@razorpay/blade-svelte` ships a smaller icon set than React Blade. Only the 29 icons listed below exist. Do not use icon names from the React docs; if a design needs an icon that is missing here, tell the user instead of inventing a name.

## How to use Icons

Import icons from `@razorpay/blade-svelte/components`. Pass them to any prop typed `IconComponent` (for example `icon` on `Button`, `Badge` or `IconButton`), or render them on their own. See `../components/Icons.md` for the icon props (`size`, `color`).

```svelte
<script lang="ts">
  import { Button, Badge, CheckCircleIcon, CreditCardIcon } from '@razorpay/blade-svelte/components';
</script>

<Button icon={CreditCardIcon}>Pay by card</Button>
<Badge icon={CheckCircleIcon} color="positive">Paid</Badge>
<CheckCircleIcon size="large" color="feedback.icon.positive.intense" />
```

## Icons

- AlertOctagonIcon
- AlertTriangleIcon
- ArrowLeftIcon
- BankIcon
- BuildingIcon
- CheckCircleIcon
- CheckIcon
- ChevronDownIcon
- ChevronLeftIcon
- ChevronRightIcon
- ChevronUpDownIcon
- CloseIcon
- CreditCardIcon
- EyeIcon
- EyeOffIcon
- HomeIcon
- InfoIcon
- LockIcon
- MailIcon
- MailOpenIcon
- MinusIcon
- MoreFilledIcon
- MoreHorizontalIcon
- PhoneIcon
- PlusIcon
- RazorpayTrustIcon
- SearchIcon
- UserIcon
- WhatsAppIcon
