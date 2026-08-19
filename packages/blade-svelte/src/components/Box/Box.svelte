<script lang="ts">
  import { MetaConstants, throwBladeError } from '@razorpay/blade-core/utils';
  import BaseBox from './BaseBox/BaseBox.svelte';
  import { validBoxAsValues } from './types';
  import type { BoxProps, MakeValueResponsive } from './types';

  let {
    element = $bindable(undefined),
    ...props
  }: BoxProps & { element?: HTMLElement } = $props();

  const validateBackgroundString = (value: string): void => {
    if (
      !value.startsWith('surface.background') &&
      !value.startsWith('overlay.') &&
      !value.startsWith('feedback.background') &&
      value !== 'transparent'
    ) {
      throwBladeError({
        message: `Oops! Currently you can only use \`transparent\`, \`surface.background.*\`, \`feedback.background.*\` and \`overlay.*\` tokens with backgroundColor property but we received \`${value}\` instead.`,
        moduleName: 'Box',
      });
    }
  };

  const validateBackgroundProp = (
    backgroundColor: MakeValueResponsive<string | undefined> | undefined,
  ): void => {
    if (!backgroundColor) return;
    if (typeof backgroundColor === 'string') {
      validateBackgroundString(backgroundColor);
      return;
    }
    Object.values(backgroundColor).forEach((value) => {
      if (typeof value === 'string') {
        validateBackgroundString(value);
      }
    });
  };

  $effect(() => {
    validateBackgroundProp(props.backgroundColor);
  });

  $effect(() => {
    if (props.as && !validBoxAsValues.includes(props.as)) {
      throwBladeError({
        message: `Invalid \`as\` prop value - ${props.as}. Only ${validBoxAsValues.join(
          ', ',
        )} are valid values`,
        moduleName: 'Box',
      });
    }
  });
</script>

<BaseBox bind:element {...props} data-blade-component={MetaConstants.Box} />
