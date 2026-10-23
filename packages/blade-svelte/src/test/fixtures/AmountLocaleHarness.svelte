<script lang="ts">
  import BladeProvider from '../../components/blade-provider/BladeProvider.svelte';
  import Amount from '../../components/amount/Amount.svelte';

  interface Props {
    locale?: string;
    ownLocale?: string;
  }

  let { locale, ownLocale }: Props = $props();
</script>

<BladeProvider adapters={{ locale }}>
  <Amount value={1234567} currency="INR" locale={ownLocale} testID="amount" />
</BladeProvider>
