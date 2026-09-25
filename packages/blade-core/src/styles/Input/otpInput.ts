// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './otpInput.module.css';

/**
 * Structural classes for OTPInput. Call from the Svelte component so the
 * CSS-module classes aren't tree-shaken.
 */
export function getOtpInputTemplateClasses(): {
  root: string;
  layout: string;
  layoutLeft: string;
  fields: string;
  field: string;
  hint: string;
} {
  return {
    root: styles.root,
    layout: styles.layout,
    layoutLeft: styles.layoutLeft,
    fields: styles.fields,
    field: styles.field,
    hint: styles.hint,
  };
}
