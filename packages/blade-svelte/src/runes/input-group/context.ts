import { defineContext } from '../context';
import type { ValidationState } from '../form/hint';
import type { FieldRecord } from '../form/types';
import type { InputGroupSpan } from './layout';

const INPUT_GROUP = defineContext<InputGroupContext>('blade-input-group');

/** What InputGroup offers the fields inside it. */
export interface InputGroupContext {
  /** The group's hint line, when it shows one: members describe themselves by it. */
  hintId: () => string | undefined;
  isDisabled: () => boolean;
  /** The group's size: its members take it. */
  size: () => 'medium' | 'large' | undefined;
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
  /** A member's control mounted or moved: re-read document order. */
  reorder: () => void;
}

export function provideInputGroup(group: InputGroupContext): void {
  INPUT_GROUP.set(group);
}

export function getInputGroup(): InputGroupContext | undefined {
  return INPUT_GROUP.get();
}
