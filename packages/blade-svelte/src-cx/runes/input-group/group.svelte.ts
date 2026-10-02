import { createOrderedEntries } from '../base/ordered-entries.svelte';
import { getForm } from '../form/context';
import { fieldIds } from '../form/field.svelte';
import { createFieldLine } from '../form/field-line.svelte';
import {
  visibleGroupError,
  type FieldHint,
  type HintContent,
  type ValidationState,
} from '../form/hint';
import type { FieldRecord } from '../form/types';
import {
  placeMembers,
  type InputGroupCorners,
  type InputGroupSpan,
} from './layout';

export interface InputGroupOptions {
  /** The host's `$props.id()`: the label and hint ids hang off it. */
  id: string;
  validationState: () => ValidationState | undefined;
  hint: () => HintContent | undefined;
}

interface Member {
  record: FieldRecord;
  span: () => InputGroupSpan;
  getElement: () => HTMLElement | undefined;
}

export interface InputGroupRune {
  /** The one line under the box and the state it puts the group in. */
  readonly hint: FieldHint;
  readonly labelId: string;
  readonly hintId: string;
  /** The corners a registered member holds; undefined for a stranger. */
  cornersOf(field: FieldRecord): InputGroupCorners | undefined;
  /** Registers a member; returns the undo. Members are read in document order. */
  register(record: FieldRecord, span: () => InputGroupSpan): () => void;
  /** A member's control mounted or moved: re-read document order. */
  reorder(): void;
}

/**
 * The input group behaviour: members in document order — a member mounted
 * later (a conditional field) takes its place — the corners their spans
 * give them, and one hint line mirroring their form errors. Call during
 * component initialisation.
 */
export function createInputGroup(options: InputGroupOptions): InputGroupRune {
  const form = getForm();
  const entries = createOrderedEntries<Member>();
  const members = $derived(entries.ordered);

  const line = createFieldLine(
    form,
    () => ({
      validationState: options.validationState(),
      hint: options.hint(),
    }),
    (state) =>
      visibleGroupError(
        members.map((member) => member.record),
        state
      )
  );
  const corners = $derived(
    placeMembers(members.map((member) => member.span()))
  );

  return {
    get hint() {
      return line.hint;
    },
    ...fieldIds(options.id),
    cornersOf(field) {
      return corners[members.findIndex((member) => member.record === field)];
    },
    register: (record, span) =>
      entries.register({
        record,
        span,
        getElement: () => record.getHandle?.() as HTMLElement | undefined,
      }),
    reorder: entries.reorder,
  };
}
