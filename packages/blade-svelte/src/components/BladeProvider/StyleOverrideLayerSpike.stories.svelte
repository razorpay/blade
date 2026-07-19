<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { getButtonClasses } from '@razorpay/blade-core/styles';

  const layeredButtonClasses = getButtonClasses({
    variant: 'primary',
    color: 'primary',
    size: 'medium',
    className: 'checkout-cta-override',
  });

  const { Story } = defineMeta({
    title: 'Guides/Style Override Layer Spike',
    tags: ['!autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Phase 0 proof: blade-core module CSS ships in `@layer blade`; unlayered consumer classes on the Button root win background and border-radius without `!important`.',
        },
      },
    },
  });
</script>

<style>
  /*
   * Unlayered consumer class — beats layered blade button internals
   * because postcss-blade-layer wraps *.module.css in @layer blade.
   */
  .checkout-cta-override {
    background-color: #6c5ce7;
    border-radius: 4px;
  }
</style>

<Story name="Button root override beats blade layer">
  <button type="button" class={layeredButtonClasses}>Pay Now</button>
</Story>
