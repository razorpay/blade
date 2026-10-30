---
'@razorpay/blade': minor
'@razorpay/blade-plugin': patch
---

feat(ChatInput): AI Elements look, `status`, compact size, context chips, "+" menu, slash commands, file limits and ambient border

No prop is renamed or removed, and `onSubmit` only widens its return type, so no code has to change. New optional props:

- `status`: `ready`, `submitted`, `streaming` or `error`, for Send, a loader, Stop or Retry. Retry sends the last message again, even if the box was cleared. `isGenerating` still works but is now deprecated: use `status="streaming"`. Blade warns in development when Stop shows without `onStop`.
- `size="small"`: a compact one-row composer that opens into the full layout once the text wraps.
- `header`: context chips (Blade `Tag`s) above the text.
- `actionMenu`: a `MenuOverlay` the "+" opens instead of the file picker, or a function that receives `openFilePicker` so a menu item can still open it (web).
- `commands` and `onCommandSelect`: slash commands (web). Each command has `value`, `title` (the name without the slash; ChatInput adds it) and an optional `description`, like `ActionListItem`.
- `maxCount`, `maxSize` and `onFileError`: file limits for picked, pasted and dropped files (web). They only guide people; servers must still check files.
- `dropTarget`: drop files on the input (default), anywhere on the page, or `none` to turn dropping off (web). With `hideFileUpload` and no `actionMenu`, dropping is off too; pasting files works as before.
- `showAmbientBorder`: a slow, decorative blue border.
- `clearOnSubmit` (opt-in): when `onSubmit` returns a promise, ChatInput clears what it sent once it resolves (only the text and files it owns, so controlled values are untouched) and keeps it when it rejects.

What every ChatInput shows now: an icon-only "+" instead of the "Upload file" link, a neutral Send that is hidden until there is something to send (it used to show disabled), a 1 px blue focus border without a focus ring, a lower shadow, one-line text so an empty box is shorter, and a blue caret. Enter no longer sends while an input method editor is composing text, and pasting text together with an image (for example from a spreadsheet) keeps the text and attaches the image. Pasted files now follow `accept`. Visual snapshots will change, and tests that look for a disabled Submit in an empty box need updating. The accessible names "Submit", "Stop generation" and "Upload file" are unchanged.

BaseInput gets internal `focusIndicator`, `visualsAlignment` and `autoGrowMinHeight` options used by ChatInput; other inputs are unchanged. The ChatInput knowledgebase doc covers the new props.
