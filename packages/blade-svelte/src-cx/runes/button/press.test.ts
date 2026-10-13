import { describe, it, expect, vi } from 'vitest';
import type { Mock } from 'vitest';
import { createForm } from '../form/form.svelte';
import type { FieldRecord, FormModel } from '../form/types';
import { createButton } from './press.svelte';
import type { ButtonOptions } from './press.svelte';

function manualSchedule(): { schedule: (fn: () => void) => () => void; tick: () => void } {
  const pending: Array<() => void> = [];
  return {
    schedule: (fn: () => void) => {
      pending.push(fn);
      return () => {
        pending.splice(pending.indexOf(fn), 1);
      };
    },
    tick: () => {
      pending.splice(0).forEach((fn) => fn());
    },
  };
}

function cardForm(value: string, onSubmit = vi.fn()): { form: FormModel; onSubmit: Mock } {
  const form = createForm({ name: 'card', onSubmit });
  const field: FieldRecord = {
    name: 'card.number',
    value,
    constraints: { kind: 'text', required: true },
  };
  form.register(field);
  return { form, onSubmit };
}

function hooks(): { onValidationFailed: Mock; onFeedback: Mock; onError: Mock } {
  return {
    onValidationFailed: vi.fn(),
    onFeedback: vi.fn(),
    onError: vi.fn(),
  };
}

function button(
  options: ButtonOptions = {},
): {
  model: ReturnType<typeof createButton>;
  hooks: ReturnType<typeof hooks>;
  timer: ReturnType<typeof manualSchedule>;
} {
  const h = hooks();
  const timer = manualSchedule();
  const model = createButton({
    hooks: h,
    schedule: timer.schedule,
    ...options,
  });
  return { model, hooks: h, timer };
}

describe('standalone button', () => {
  it('forwards the press with medium feedback', async () => {
    const onClick = vi.fn();
    const { model, hooks: h } = button({ onClick });
    const decision = model.press('event');
    expect(decision.prevented).toBe(false);
    await decision.settled;
    expect(onClick).toHaveBeenCalledWith('event');
    expect(h.onFeedback).toHaveBeenCalledWith('medium');
  });

  it('an async onClick drives loading', async () => {
    let release: (v?: unknown) => void = () => undefined;
    const promise = new Promise((resolve) => {
      release = resolve;
    });
    const { model } = button({ onClick: () => promise });
    const decision = model.press();
    expect(model.loading).toBe(true);
    release();
    await decision.settled;
    expect(model.loading).toBe(false);
  });

  it('routes an onClick rejection to onError and clears loading', async () => {
    const failure = new Error('nope');
    const { model, hooks: h } = button({
      onClick: () => Promise.reject(failure),
    });
    await model.press().settled;
    expect(h.onError).toHaveBeenCalledWith(failure);
    expect(model.loading).toBe(false);
  });
});

describe('inside a form', () => {
  it('a valid submit drives the form model once and cancels the native submit', async () => {
    const { form, onSubmit } = cardForm('4111');
    const onClick = vi.fn();
    const { model, hooks: h } = button({ form, onClick });
    const decision = model.press('event');
    expect(decision.prevented).toBe(true);
    await decision.settled;
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith('event');
    expect(h.onFeedback).toHaveBeenCalledWith('medium');
  });

  it('an invalid submit with validateForm shakes, reports errors and skips the click', async () => {
    const { form, onSubmit } = cardForm('');
    const onClick = vi.fn();
    const { model, hooks: h, timer } = button({
      form,
      onClick,
      validateForm: () => true,
    });
    const decision = model.press();
    await decision.settled;
    expect(onSubmit).not.toHaveBeenCalled();
    expect(h.onValidationFailed).toHaveBeenCalledWith({
      'card.number': 'required',
    });
    expect(h.onFeedback).toHaveBeenCalledWith('warning');
    expect(onClick).not.toHaveBeenCalled();
    expect(model.shake).toBe(true);
    timer.tick();
    expect(model.shake).toBe(false);
  });

  it('an invalid submit without validateForm stays quiet', async () => {
    const { form, onSubmit } = cardForm('');
    const { model, hooks: h } = button({ form });
    await model.press().settled;
    expect(onSubmit).not.toHaveBeenCalled();
    expect(h.onValidationFailed).not.toHaveBeenCalled();
    expect(h.onFeedback).toHaveBeenCalledWith('medium');
    expect(model.shake).toBe(false);
  });

  it('type=button with validateForm only validates; submission is the consumer’s', async () => {
    const { form, onSubmit } = cardForm('4111');
    const onClick = vi.fn();
    const { model } = button({
      form,
      onClick,
      type: () => 'button',
      validateForm: () => true,
    });
    const decision = model.press();
    expect(decision.prevented).toBe(false);
    await decision.settled;
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onClick).toHaveBeenCalled();
  });

  it('type=button with validateForm on an invalid form skips the click', async () => {
    const { form, onSubmit } = cardForm('');
    const onClick = vi.fn();
    const { model, hooks: h } = button({
      form,
      onClick,
      type: () => 'button',
      validateForm: () => true,
    });
    await model.press().settled;
    expect(onSubmit).not.toHaveBeenCalled();
    expect(h.onValidationFailed).toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('routes a submit failure to onError instead of rejecting settled', async () => {
    const failure = new Error('submit down');
    const form = {
      ...cardForm('4111').form,
      submit: () => Promise.reject(failure),
    };
    const onClick = vi.fn();
    const { model, hooks: h } = button({ form, onClick });
    await model.press().settled;
    expect(h.onError).toHaveBeenCalledWith(failure);
    // The press still completes: feedback and the consumer click run.
    expect(h.onFeedback).toHaveBeenCalledWith('medium');
    expect(onClick).toHaveBeenCalled();
  });
});
