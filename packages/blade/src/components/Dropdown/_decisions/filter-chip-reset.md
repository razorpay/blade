# FilterChipGroup — "Reset" vs "Clear" (Phased Plan)

Context: a consumer asked for a **Reset** option on the filter bar instead of **Clear Filters**.
"Clear" and "Reset" are semantically different:

- **Clear** → remove all selections, go to the **empty** (no-filter) state.
- **Reset** → return filters to their **default / initial** values, which may be **non-empty**
  (e.g. `Status: Active`, `Date: Last 7 days`).

The tricky part is the source of truth for "default":

- **Controlled filters** → the consumer owns state, so only they can restore defaults.
- **Uncontrolled filters** → the chip owns state, but select filters have **no `defaultValue`**
  concept today (only `FilterChipDatePicker` has one).

## Phase 1 — DONE (controlled-safe reset via separate Clear/Reset actions)

Shipped on `FilterChipGroup` (web only; native is a stub). Clear and Reset are modelled as **two
independent actions** (per review feedback — a single overloaded `clearButtonBehavior` flag
conflated the two semantics and couldn't express "offer both"):

- **`onClearButtonClick?: () => void`** + **`showClearAction?: boolean`** (default `true`) —
  the existing **Clear** action. Empties every filter: clears ListView context + selected-filter
  tracking and bumps the clear triggerer so each child chip runs its clear effect.
- **`onResetButtonClick?: () => void`** + **`showResetAction?: boolean`** (default `true`) —
  opt-in **Reset** action. Fires the callback and clears the
  group's own "has changes" bookkeeping so the action hides after use, but does NOT bump the clear
  triggerer. Not bumping the triggerer is the key bit — it prevents the chips from firing
  `onChange([])` and stomping the defaults the consumer restores inside `onResetButtonClick`. The
  action reappears on the next filter change. `showResetAction` can be set to `false` to hide the
  Reset action while keeping the callback available for programmatic use.
- **`clearButtonText?` / `resetButtonText?`** — customise each action's label (defaults:
  auto-pluralised `"Clear Filter(s)"` and `"Reset"`).
- Both actions can be rendered **simultaneously** (provide both handlers).

This unblocks the **controlled** (and mixed, controlled-leaning) use cases.

## Phase 2 — TODO (uncontrolled reset-to-defaults)

Not yet implemented. Required so a `'reset'` action can restore defaults for **uncontrolled**
filters:

1. Add **`defaultValue`** to `FilterChipSelectInput` (option value or array) — the missing
   "default" for select filters. (`FilterChipDatePicker` already has `defaultValue`.)
2. In `'reset'` mode, make the group broadcast a **reset triggerer** (separate from the clear
   triggerer) that each uncontrolled chip listens to and uses to **restore its `defaultValue`**
   (map value(s) → selected indices) instead of emptying. Controlled chips continue to ignore it
   and rely on the consumer.
3. Keep the ListView **`selectedFiltersCount`** accurate after a reset — non-empty defaults must
   still count as "selected" so the button visibility/label stays correct.
4. Consider **disabling/hiding** the action button when the current state already equals the
   defaults (nice-to-have).

## Things to watch (both phases)

- **Label ↔ behavior must match.** Don't ship `"Reset"` wording that still empties everything.
- **Design-system consistency.** Align "reset vs clear" with design so it's a standardised
  pattern, not a one-off.
- **Native.** `FilterChipGroup` is currently a stub on native; any behavior must be mirrored when
  it is implemented there.

Code entry points:

- `packages/blade/src/components/Dropdown/FilterChipGroup.web.tsx` (`handleClearButtonClick`)
- `packages/blade/src/components/Dropdown/FilterChipSelectInput.web.tsx` (clear triggerer effect)
- `packages/blade/src/components/Dropdown/types.ts` (`FilterChipGroupProps`)
