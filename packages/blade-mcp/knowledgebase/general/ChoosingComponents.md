# Choosing the Right Component

Several Blade components let a user choose from a set of options, and a few of them look visually similar (most notably `Tabs` and `SegmentedControl`). Pick the component based on **how the selection behaves**, not just how it looks.

Use this decision tree, then confirm against the quick-reference and the specific component's own "When to Use" section (via `get_blade_component_docs`).

## Decision tree

1. **Can more than one option be selected at once?**
   - **Yes (multi-select):**
     - Are the labels short (1–2 words) and consistent?
       - **Yes** → `Chip` (`ChipGroup` with `selectionType="multiple"`) — acts like toggle buttons.
       - **No** (longer / inconsistent labels) → `Checkbox` (`CheckboxGroup`), typically in a list-item layout.
   - **No (single select):** go to step 2.

2. **Does selecting an option immediately change or filter the visible page content** (rather than just storing a value to be submitted later)?
   - **Yes** → go to step 3.
   - **No — it's a value submitted in a form** → go to step 4.

3. **(Selection changes visible content)** Is the user switching between **distinct sections/views, each with its own content panel**?
   - **Yes** → `Tabs`. Use when selecting an option swaps out an entire panel of content (e.g. Subscription / Plans / Settings).
   - **No — it re-filters or re-represents the _same_ content** with 2–5 short options → `SegmentedControl` (e.g. a Daily / Weekly / Monthly toggle above one chart, or a List / Grid view switch).

4. **(Form value)** How many options are there?
   - **1 (binary on/off):** Does it need a separate confirm/submit action to take effect?
     - **No — applies instantly** → `Switch` (settings, feature toggles; selection is execution).
     - **Yes** (e.g. "I accept the terms") → `Checkbox` (single).
   - **2–5 options:** Are the labels short (1–2 words) and consistent?
     - **Yes** → `Chip` (`selectionType="single"`) — compact, segmented-control style.
     - **No** (longer / descriptive labels) → `Radio` (`RadioGroup`), in a list-item layout.
   - **More than 5 options** → `Dropdown` (with `SelectInput`). Use `AutoComplete` instead when the list is searchable or large (10+ items).

## Quick reference

| Component | Use when |
| --- | --- |
| `Switch` | A single binary on/off where selection is execution — applies instantly with no submit step (settings, feature toggles). |
| `Checkbox` | Multi-select with longer / inconsistent labels, OR a single binary choice needing a confirm/submit action (e.g. "I accept the terms"). |
| `Radio` | Exactly one option from 2–5 choices with longer / descriptive labels, submitted as a form value. |
| `Chip` | 2–5 short, consistent (1–2 word) options — single-select acts like a segmented control, multi-select acts like toggle buttons. Compact and inline. |
| `SegmentedControl` | A single choice of 2–5 short options that re-filters or changes the representation of the same content (e.g. Daily / Weekly / Monthly, List / Grid). |
| `Tabs` | Navigating between distinct views/sections within a page, where each tab reveals its own content panel. |
| `Dropdown` (`SelectInput`) | Selecting from more than 5 predefined options (single or multi). Use `AutoComplete` for searchable / large lists. |

## Tabs vs SegmentedControl (most commonly confused)

Both are single-select controls that change what's visible, and they look alike. The distinction is **what the selection does**:

- Use `Tabs` when selecting an option reveals its **own, distinct content panel** — i.e. you're navigating between larger sections of content within the same page.
- Use `SegmentedControl` when the control just **changes how the _same_ content is displayed or filtered**, with 2–5 short, consistent options.

Rule of thumb: if selecting swaps out an entire panel of content, use `Tabs`; if it only re-filters or re-represents content already on the page, use `SegmentedControl`.

**Don't** use either for page-level navigation between separate routes — use `SideNav`, `TopNav`, or `BottomNav` instead.
