import { getContext, setContext } from 'svelte';
import type { ValidationState } from '../form/hint';
import type { FieldRecord } from '../form/types';
import type { InputGroupSpan } from './layout';

const INPUT_GROUP = Symbol('blade-input-group');

/** What InputGroup offers the fields inside it. */
export interface InputGroupContext {
  /** The group's hint line, when it shows one: members describe themselves by it. */
  hintId: () => string | undefined;
  isDisabled: () => boolean;
  /** The state the host passed to the group, if any. */
  validationState: () => ValidationState | undefined;
  /** The group owns the grid, so it maps a member's span. */
  spanClass: (span: InputGroupSpan) => string;
  /** For a member's root: the join with its neighbours. */
  joinClass: () => string;
  /** For a registered member's frame: the group's corners it holds. */
  cornerClass: (field: FieldRecord) => string;
  /**
   * The group's line mirrors its members' form errors, and their spans in
   * order place them in the grid. Returns the undo.
   */
  register: (field: FieldRecord, span: () => InputGroupSpan) => () => void;
}

export function provideInputGroup(group: InputGroupContext): void {
  setContext(INPUT_GROUP, group);
}

export function getInputGroup(): InputGroupContext | undefined {
  return getContext<InputGroupContext | undefined>(INPUT_GROUP);
}
