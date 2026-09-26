import { getContext, setContext } from 'svelte';
import type { FormErrors, FormModel } from './types';

const FORM = Symbol('blade-form');

/** What the Form anatomy offers the components inside it, beyond the model. */
export interface FormHooks {
  /**
   * A submit or validate attempt found errors: the Form tells its host and
   * reveals the first invalid field. One handler per form — every button
   * inside, and the Enter key, report here.
   */
  onInvalid?: (errors: FormErrors) => void;
}

const FORM_HOOKS = Symbol('blade-form-hooks');

/** Form.svelte publishes its model here; fields and buttons pick it up. */
export function provideForm(form: FormModel, hooks: FormHooks = {}): void {
  setContext(FORM, form);
  setContext(FORM_HOOKS, hooks);
}

export function getFormHooks(): FormHooks {
  return getContext<FormHooks | undefined>(FORM_HOOKS) ?? {};
}

export function getForm(): FormModel | undefined {
  return getContext<FormModel | undefined>(FORM);
}
