import { defineContext } from '../context';
import type { FormErrors, FormModel } from './types';

const FORM = defineContext<FormModel>('blade-form');

/** What the Form anatomy offers the components inside it, beyond the model. */
export interface FormHooks {
  /**
   * A submit or validate attempt found errors: the Form tells its host and
   * reveals the first invalid field. One handler per form — every button
   * inside, and the Enter key, report here.
   */
  onInvalid?: (errors: FormErrors) => void;
}

const FORM_HOOKS = defineContext<FormHooks>('blade-form-hooks');

/** Form.svelte publishes its model here; fields and buttons pick it up. */
export function provideForm(form: FormModel, hooks: FormHooks = {}): void {
  FORM.set(form);
  FORM_HOOKS.set(hooks);
}

export function getFormHooks(): FormHooks {
  return FORM_HOOKS.get() ?? {};
}

export function getForm(): FormModel | undefined {
  return FORM.get();
}
