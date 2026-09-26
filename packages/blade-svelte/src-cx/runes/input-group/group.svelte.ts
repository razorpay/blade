import { getForm } from '../form/context';
import { createFieldLine } from '../form/field-line.svelte';
import {
  visibleGroupError,
  type FieldHint,
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
  hint: () => string | undefined;
}

interface Member {
  record: FieldRecord;
  span: () => InputGroupSpan;
}

export interface InputGroupRune {
  /** The one line under the box and the state it puts the group in. */
  readonly hint: FieldHint;
  readonly labelId: string;
  readonly hintId: string;
  /** The corners a registered member holds; undefined for a stranger. */
  cornersOf(field: FieldRecord): InputGroupCorners | undefined;
  /** Registers a member in order; returns the undo. */
  register(record: FieldRecord, span: () => InputGroupSpan): () => void;
}

/**
 * The input group behaviour: members in order, the corners their spans
 * give them, and one hint line mirroring their form errors. Call during
 * component initialisation.
 */
export function createInputGroup(options: InputGroupOptions): InputGroupRune {
  const form = getForm();
  let members = $state.raw<Member[]>([]);

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
    labelId: `${options.id}-label`,
    hintId: `${options.id}-hint`,
    cornersOf(field) {
      return corners[members.findIndex((member) => member.record === field)];
    },
    register(record, span) {
      members = [...members, { record, span }];
      return () => {
        members = members.filter((member) => member.record !== record);
      };
    },
  };
}
