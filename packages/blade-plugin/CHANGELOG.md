# @razorpay/blade-plugin

## 1.33.2

### Patch Changes

- df3bec8ef: fix(blade-svelte): guard the paths a 0.x app trips on

  - **PhoneNumberInput**: `country` defaults to `'IN'`, as Blade React's, instead of the first country by name (Afghanistan); `countryLabel` is optional, `'Country'` by default, instead of rendering `undefined` into the button's name.
  - **OTPInput**: a composing soft keyboard's keydown (`Unidentified`, keyCode 229, `Process`, `isComposing`) is left to `input`, so Android keyboards fill the cells.
  - **Button**: hover, press and focus looks apply only while enabled; a disabled or busy button under a pointer no longer paints as enabled, and a busy one shows no focus ring.
  - **Overlays**: `onDismiss`'s event takes `preventDefault()`, which keeps a dismissible modal, sheet or drawer open for that dismissal (ask first, then `close()`), without hiding the close button as `isDismissible={false}` does.
  - **Overlays**: focus returns to the opener without the browser's scroll jump, as it moved in.
  - **README**: a migration table from 0.x, pointing at the lint `allow` option and token repointing.

- a6c5ce006: feat(blade-svelte): add the new icons from Blade React
- a62de405e: feat(blade-svelte): add the new icons from Blade React
- a62de405e: feat(icons): add ListTodoIcon, ListChecksIcon, TerminalIcon and 2 more

## 1.33.1

### Patch Changes

- 95b9daa92: feat(blade-plugin): expand the blade-svelte knowledgebase

  - The `blade-svelte` skill covers the Tailwind implementation of `@razorpay/blade-svelte`: general docs for setup and conventions (including the app shell BladeProvider's overlays rely on), styling with Blade's token classes, theming through CSS variables, adapters and the icon list.
  - Its examples are compiled and checked against the package's exports, props and class lint in CI.

## 1.33.0

### Minor Changes

- bd9d3e0d1: feat(blade-plugin): add blade-svelte support

  - New `blade-svelte` skill with a knowledgebase for every public `@razorpay/blade-svelte` component, a Svelte setup guide, the Svelte icon list, and the shared token and white-labelling docs.
  - Skill scripts send `Blade Plugin Tool Called` instead of `Blade MCP Tool Called`, with a `framework` property (`react` or `svelte`). The `blade-svelte` skill reports lines of code like the `blade` skill.
  - Hooks detect whether a project uses `@razorpay/blade`, `@razorpay/blade-svelte` or both, and point the agent at the matching skill.
  - `blade-plugin` now versions independently of `blade-mcp`.

### Patch Changes

- be69e99d4: fix(FileUpload): refresh the uploaded-file row and drop area to match Figma

  Uploaded-file row (`FileUploadItem`):

  - The colour-coded file-type icon is replaced by a 40px tile with a generic file icon. A failed file shows a red info icon instead
  - File name is 12px medium and the size or error line is 11px. The success check icon is 12px, 4px after the name
  - Failed rows have a white background and no hover colour change. The red border stays
  - A failed file inside `FileUpload` now offers only "Reupload", shown with its label. Reupload already removes the file before reopening the picker. When `FileUploadItem` is used directly with both `onReupload` and `onRemove`, it keeps the icon-only reupload button next to the trash button
  - The reupload button only renders when `onReupload` is passed, and the trash button only renders when `onRemove` is passed
  - Uploading rows read "Uploading {file name} ...". ChatInput attachments keep the plain file name
  - Row heights are unchanged: 56px for small and medium, 64px for large and variable

  Drop area:

  - Border uses `interactive.border.gray.highlighted`, and `interactive.border.primary.faded` while a file is dragged over it (web) or it is pressed (native)
  - Medium size has 8px corners (was 12px). Small stays 8px; large and variable stay 12px
  - `size="variable"` shows a 56px circle with a generic file icon instead of the file-type icon, with 12px between the icon and the text
  - The "Upload" link label is no longer underlined

  **Behaviour change:** inside `FileUpload`, failed files (`status: 'error'`) no longer show a trash button, so `onRemove` is not called from a failed row. Clicking Reupload removes the file and reopens the picker, then calls `onReupload`, or `onRemove` when `onReupload` is not passed. In controlled mode, remove or replace the failed file from `fileList` inside `onReupload`.

  No props were added, removed or renamed. The FileUpload knowledgebase doc notes that failed files offer only Reupload.
