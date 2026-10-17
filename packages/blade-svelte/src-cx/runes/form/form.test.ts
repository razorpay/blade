import { describe, it, expect, vi } from 'vitest';
import { flushSync } from 'svelte';
import { watch } from '../../test/watch.svelte';
import { collectFormData, createForm } from './form.svelte';
import type { FieldRecord } from './types';

function field(
  name: string | undefined,
  value: unknown,
  extra: Partial<FieldRecord> = {},
): FieldRecord {
  return { name, value, ...extra };
}

const flush = (): Promise<unknown> => new Promise((resolve) => setTimeout(resolve, 0));

describe('collectFormData', () => {
  it('nests dotted names for data and touched, keeps constraint errors flat, skips unnamed fields', () => {
    const snapshot = collectFormData(
      [
        field('card.number', '', {
          constraints: { kind: 'text', required: true },
        }),
        field('card.name', 'Ada', { touched: true }),
        field(undefined, 'ignored'),
      ],
      false,
    );

    expect(snapshot.data).toEqual({ card: { number: '', name: 'Ada' } });
    expect(snapshot.touched).toEqual({ card: { number: false, name: true } });
    expect(snapshot.constraintErrors).toEqual({ 'card.number': 'required' });
  });

  it('formats constraint errors with the injected formatter', () => {
    const snapshot = collectFormData(
      [field('vpa', '', { constraints: { kind: 'text', required: true } })],
      false,
      (code, f) => `${f.name}:${code}`,
    );
    expect(snapshot.constraintErrors).toEqual({ vpa: 'vpa:required' });
  });

  it('marks every field touched once the form is submitted', () => {
    const snapshot = collectFormData([field('vpa', ''), field('save', false)], true);
    expect(snapshot.touched).toEqual({ vpa: true, save: true });
  });
});

describe('createForm validation', () => {
  it('merges constraint errors with validator errors, validator winning per key', () => {
    const form = createForm({
      name: 'card',
      validator: () => ({ 'card.number': 'Invalid card' }),
    });
    const required = { kind: 'text', required: true } as const;
    form.register(field('card.number', '', { constraints: required }));
    form.register(field('card.cvv', '', { constraints: required }));

    void form.refresh('input', 'card.number');

    expect(form.snapshot().errors).toEqual({
      'card.number': 'Invalid card',
      'card.cvv': 'required',
    });
  });

  it('uses formatted constraint errors alone when there is no validator', () => {
    const form = createForm({
      name: 'plain',
      formatConstraintError: (code) => `msg:${code}`,
    });
    form.register(field('vpa', '', { constraints: { kind: 'text', required: true } }));

    void form.refresh();

    expect(form.snapshot().errors).toEqual({ vpa: 'msg:required' });
  });

  it('reports validation with reason, field name and the new errors', () => {
    const onValidate = vi.fn();
    const form = createForm({
      name: 'f',
      validator: () => ({ vpa: 'Bad' }),
      hooks: { onValidate },
    });
    form.register(field('vpa', 'x'));

    void form.refresh('blur', 'vpa');

    expect(onValidate).toHaveBeenCalledWith({
      reason: 'blur',
      name: 'vpa',
      errors: { vpa: 'Bad' },
      data: { vpa: 'x' },
      touched: { vpa: false },
    });
  });

  it('applies only the newest async validation result', async () => {
    let resolveFirst: (v: Record<string, string>) => void = () => {
      // noop
    };
    let resolveSecond: (v: Record<string, string>) => void = () => {
      // noop
    };
    const validator = vi
      .fn()
      .mockImplementationOnce(() => new Promise((resolve) => (resolveFirst = resolve)))
      .mockImplementationOnce(() => new Promise((resolve) => (resolveSecond = resolve)));
    const onPromise = vi.fn();
    const form = createForm({ name: 'f', validator, hooks: { onPromise } });
    form.register(field('vpa', 'a'));

    const first = form.refresh('input', 'vpa');
    const second = form.refresh('input', 'vpa');
    resolveSecond({ vpa: 'second' });
    await second;
    resolveFirst({ vpa: 'first' });
    await first;

    expect(form.snapshot().errors).toEqual({ vpa: 'second' });
    expect(onPromise).toHaveBeenCalledWith('validate', expect.any(Promise), 'vpa');
  });

  it('routes validator rejections to onError and keeps the previous errors', async () => {
    const onError = vi.fn();
    const failure = new Error('network');
    const form = createForm({
      name: 'f',
      validator: () => Promise.reject(failure),
      hooks: { onError },
    });
    form.register(field('vpa', 'a'));

    await form.refresh('input', 'vpa');

    expect(onError).toHaveBeenCalledWith(failure);
    expect(form.snapshot().errors).toEqual({});
  });
});

describe('createForm submission', () => {
  it('blocks submit on errors, marks all fields touched and finds the first invalid in registration order', async () => {
    const onSubmit = vi.fn();
    const handle = { focus: vi.fn() };
    const form = createForm({
      name: 'card',
      validator: () => ({ 'card.cvv': 'Too short', 'card.name': 'Required' }),
      onSubmit,
    });
    form.register(field('card.number', '4111'));
    form.register(
      field('card.cvv', '1', {
        getHandle: () => handle as never,
      }),
    );
    form.register(field('card.name', ''));

    const outcome = await form.submit({ source: 'button', field: 'pay' });

    expect(outcome.ok).toBe(false);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(form.snapshot().submitted).toBe(true);
    expect(form.snapshot().touched).toEqual({
      card: { number: true, cvv: true, name: true },
    });
    expect(form.firstInvalid()).toEqual({ name: 'card.cvv', handle });
  });

  it('reads its fields in document order, not registration order', async () => {
    const form = createForm({
      name: 'card',
      validator: () => ({ 'card.cvv': 'Too short', 'card.name': 'Required' }),
    });
    const fieldset = document.createElement('div');
    const cvvInput = document.createElement('input');
    const nameInput = document.createElement('input');
    fieldset.append(cvvInput, nameInput);
    // card.name registers first, but card.cvv sits before it (a remount).
    form.register(field('card.name', '', { getHandle: () => nameInput as never }));
    form.register(field('card.cvv', '1', { getHandle: () => cvvInput as never }));
    form.reorder();

    await form.validate();
    expect(form.firstInvalid()?.name).toBe('card.cvv');
  });

  it('reveals the first invalid field through the injected revealField', async () => {
    const revealField = vi.fn();
    const handle = { focus: vi.fn() };
    const form = createForm({
      name: 'f',
      validator: () => ({ vpa: 'Bad' }),
      revealField,
    });
    form.register(field('vpa', '', { getHandle: () => handle as never }));

    await form.validate();
    form.revealFirstInvalid();

    expect(revealField).toHaveBeenCalledWith(handle, 'vpa');
  });

  it('submits valid data with the platform event and tracks an async onSubmit', async () => {
    const onSubmit = vi.fn().mockReturnValue(Promise.resolve('created'));
    const hooks = { onSubmitLogged: vi.fn(), onPromise: vi.fn() };
    const form = createForm({ name: 'upi', onSubmit, hooks });
    form.register(field('vpa', 'a@upi'));
    const event = { type: 'submit' };

    const outcome = await form.submit({ source: 'programmatic', event });

    expect(outcome.ok).toBe(true);
    expect(onSubmit).toHaveBeenCalledWith({ vpa: 'a@upi' }, event);
    expect(hooks.onSubmitLogged).toHaveBeenCalledWith({
      data: { vpa: 'a@upi' },
    });
    expect(form.snapshot().submitting).toBe(true);

    await expect(outcome.result).resolves.toBe('created');
    await flush();

    expect(form.snapshot().submitting).toBe(false);
    expect(hooks.onPromise.mock.calls.map((call) => call[0])).toEqual([
      'submit',
      'submit_successful',
    ]);
  });

  it('logs a failed async submission and clears submitting', async () => {
    const onPromise = vi.fn();
    const form = createForm({
      name: 'upi',
      onSubmit: () => Promise.reject(new Error('declined')),
      hooks: { onPromise },
    });
    form.register(field('vpa', 'a@upi'));

    const outcome = await form.submit({ source: 'button' });
    await (outcome.result as Promise<unknown>).catch(() => undefined);
    await flush();

    expect(onPromise.mock.calls.map((call) => call[0])).toEqual(['submit', 'submit_failed']);
    expect(form.snapshot().submitting).toBe(false);
  });

  it('validate sets submitted and reports the first invalid field', async () => {
    const form = createForm({ name: 'f', validator: () => ({ b: 'Bad' }) });
    form.register(field('a', 1));
    form.register(field('b', 2));

    const result = await form.validate({ reason: 'click', name: 'pay' });

    expect(result).toEqual({
      ok: false,
      errors: { b: 'Bad' },
      firstInvalid: 'b',
    });
    expect(form.snapshot().touched).toEqual({ a: true, b: true });
  });
});

describe('createForm triggers and state', () => {
  it('handleInput validates, then notifies onInput and the change log', async () => {
    const calls: string[] = [];
    const form = createForm({
      name: 'f',
      validator: () => {
        calls.push('validate');
        return {};
      },
      onInput: (data, event) => {
        calls.push(`input:${JSON.stringify(data)}:${String(event)}`);
      },
      hooks: {
        onInputLogged: () => {
          calls.push('logged');
        },
      },
    });
    form.register(field('vpa', 'a'));

    await form.handleInput('vpa', 'evt');

    expect(calls).toEqual(['validate', 'input:{"vpa":"a"}:evt', 'logged']);
  });

  it('handleBlur defers validation through the injected scheduler', () => {
    const defer = vi.fn();
    const validator = vi.fn().mockReturnValue({});
    const form = createForm({ name: 'f', validator, defer });
    form.register(field('vpa', 'a'));

    form.handleBlur('vpa');
    expect(validator).not.toHaveBeenCalled();

    defer.mock.calls[0][0]();
    expect(validator).toHaveBeenCalledWith({ vpa: 'a' });
  });

  it('reset clears errors, touched and submitted', async () => {
    const form = createForm({ name: 'f', validator: () => ({ vpa: 'Bad' }) });
    const record = field('vpa', '', { touched: true });
    form.register(record);
    await form.submit({ source: 'button' });

    form.reset();

    expect(record.touched).toBe(false);
    expect(form.snapshot()).toEqual({
      data: { vpa: '' },
      touched: { vpa: false },
      errors: {},
      submitted: false,
      submitting: false,
    });
  });

  it('knows which names are registered', () => {
    const form = createForm({ name: 'f' });
    const unregister = form.register(field('vpa', 'a'));
    expect(form.hasField('vpa')).toBe(true);
    expect(form.hasField('other')).toBe(false);
    form.register(field('bank', null, { aliases: ['radio-3'] }));
    expect(form.hasField('radio-3')).toBe(true);
    expect(form.hasField(undefined)).toBe(false);
    unregister();
    expect(form.hasField('vpa')).toBe(false);
  });

  it('publishes state to whatever reads it and drops unregistered fields', () => {
    const form = createForm({ name: 'f' });
    const seen = watch(() => form.state.data);
    const unregister = form.register(field('vpa', 'a'));

    void form.refresh();
    flushSync();
    unregister();
    void form.refresh();
    flushSync();

    expect(seen.seen).toEqual([{}, { vpa: 'a' }, {}]);
    expect(form.state).toEqual(form.snapshot());
    seen.stop();
  });
});
