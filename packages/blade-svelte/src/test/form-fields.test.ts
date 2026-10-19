import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import type { FieldRecord, FormAdapter } from '../runes/form/types';
import FormFieldsHarness from './fixtures/FormFieldsHarness.svelte';
import CardGroupFormHarness from './fixtures/CardGroupFormHarness.svelte';

function fakeForm(): FormAdapter & {
  input: ReturnType<typeof vi.fn>;
  blur: ReturnType<typeof vi.fn>;
} {
  return {
    register: () => () => undefined,
    input: vi.fn(),
    blur: vi.fn(),
    errorOf: () => undefined,
    isSubmitting: false,
    submit: () => Promise.resolve({ ok: true, errors: {} }),
    validate: () => Promise.resolve({ ok: true, errors: {} }),
    invalid: () => undefined,
  };
}

function type(control: HTMLElement, text: string): Promise<boolean> {
  (control as HTMLInputElement).value = text;
  return fireEvent.input(control);
}

describe('fields and the app form', () => {
  it('a keystroke the format rejects reaches neither the host nor the form', async () => {
    const form = fakeForm();
    const { getByTestId } = render(FormFieldsHarness, {
      props: { adapters: { form }, field: 'text' },
    });
    const control = getByTestId('field');
    await type(control, '4');
    expect(form.input).toHaveBeenCalledTimes(1);
    expect(form.input).toHaveBeenLastCalledWith('text', expect.anything());
    await type(control, '4a');
    expect(form.input).toHaveBeenCalledTimes(1);
    expect((control as HTMLInputElement).value).toBe('4');
  });

  it('the clear button tells the form, as typing does', async () => {
    const form = fakeForm();
    const { getByTestId, getByLabelText } = render(FormFieldsHarness, {
      props: { adapters: { form }, field: 'text' },
    });
    await type(getByTestId('field'), '42');
    form.input.mockClear();
    await fireEvent.click(getByLabelText('Clear Input Content'));
    expect(form.input).toHaveBeenCalledWith('text', undefined);
    expect((getByTestId('field') as HTMLInputElement).value).toBe('');
  });

  it('a mask keystroke reports the formatted value', async () => {
    const form = fakeForm();
    const { getByTestId } = render(FormFieldsHarness, {
      props: { adapters: { form }, field: 'text', format: '##/##' },
    });
    const control = getByTestId('field') as HTMLInputElement;
    expect(control.maxLength).toBe(5);
    await type(control, '123');
    expect(control.value).toBe('12/3');
    expect(form.input).toHaveBeenCalledTimes(1);
  });

  it.each(['text', 'textarea', 'password', 'otp'] as const)(
    '%s: the first blur after an autofocus is a blur like any other, as Blade',
    async (field) => {
      const form = fakeForm();
      const { container } = render(FormFieldsHarness, {
        props: { adapters: { form }, field, autoFocus: true },
      });
      const control = container.querySelector<HTMLElement>('input, textarea')!;
      expect(document.activeElement).toBe(control);
      await fireEvent.blur(control);
      await fireEvent.focusOut(control);
      expect(form.blur).toHaveBeenCalled();
    },
  );
});

describe('a field record: its element and its reveal', () => {
  function recordingForm(): { form: FormAdapter; records: FieldRecord[] } {
    const records: FieldRecord[] = [];
    const form = {
      ...fakeForm(),
      register: (record: FieldRecord) => {
        records.push(record);
        return () => undefined;
      },
    };
    return { form, records };
  }

  it.each(['text', 'textarea', 'password', 'counter'] as const)(
    '%s: the element is its control, and a reveal focuses it',
    (field) => {
      const { form, records } = recordingForm();
      const { container } = render(FormFieldsHarness, { props: { adapters: { form }, field } });
      const control = container.querySelector<HTMLElement>('input, textarea')!;
      expect(records).toHaveLength(1);
      expect(records[0].element()).toBe(control);
      records[0].reveal();
      expect(document.activeElement).toBe(control);
    },
  );

  it('otp: a reveal focuses the cell typing would fill', async () => {
    const { form, records } = recordingForm();
    const { container } = render(FormFieldsHarness, {
      props: { adapters: { form }, field: 'otp' },
    });
    const cells = Array.from(container.querySelectorAll('input'));
    expect(records[0].element()?.contains(cells[0])).toBe(true);
    records[0].reveal();
    expect(document.activeElement).toBe(cells[0]);
    await type(cells[0], '1');
    await type(cells[1], '2');
    (document.activeElement as HTMLElement).blur();
    records[0].reveal();
    expect(document.activeElement).toBe(cells[2]);
  });

  it('card group: the element is the row, and a reveal focuses the control inside it', () => {
    const { form, records } = recordingForm();
    const { getByTestId } = render(CardGroupFormHarness, { props: { form } });
    const row = records[0].element();
    expect(getByTestId('banks').contains(row ?? null)).toBe(true);
    records[0].reveal();
    expect(document.activeElement).not.toBe(row);
    expect(row?.contains(document.activeElement)).toBe(true);
  });
});

describe('analytics', () => {
  it.each(['text', 'textarea', 'password', 'otp', 'counter'] as const)(
    '%s: a touch tracks the field name, never its value',
    async (field) => {
      const track = vi.fn();
      const { container } = render(FormFieldsHarness, { props: { adapters: { track }, field } });
      const control = container.querySelector<HTMLElement>('input, textarea')!;
      await type(control, '12');
      await fireEvent.blur(control);
      await fireEvent.focusOut(control);
      const touches = track.mock.calls.filter(([event]) => event === 'field_change');
      for (const [, payload] of touches) {
        expect(Object.keys(payload)).toEqual(['name']);
      }
      if (field !== 'counter') {
        expect(touches.length).toBeGreaterThan(0);
      }
    },
  );

  it.each([
    ['text', 'input'],
    ['textarea', 'textarea'],
    ['password', 'input'],
    ['otp', 'input'],
  ] as const)('%s: data-analytics-* lands on the control, as Blade', (field, tag) => {
    const { container } = render(FormFieldsHarness, { props: { adapters: {}, field } });
    const marked = container.querySelectorAll('[data-analytics-field]');
    expect(marked.length).toBe(field === 'otp' ? 4 : 1);
    for (const element of marked) {
      expect(element.tagName.toLowerCase()).toBe(tag);
    }
  });

  it('counter: data-analytics-* lands on the root, as Blade', () => {
    const { getByTestId } = render(FormFieldsHarness, {
      props: { adapters: {}, field: 'counter' },
    });
    expect(getByTestId('field').getAttribute('data-analytics-field')).toBe('count');
  });
});
