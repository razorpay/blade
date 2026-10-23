---
'@razorpay/blade': minor
'@razorpay/blade-plugin': patch
'@razorpay/blade-mcp': patch
---

feat(ChatInput): add `size="small"` for a compact, one-row composer

`ChatInput` now takes `size?: 'small' | 'medium'`. `medium` is the default and looks the same as before.

`size="small"` puts everything in one row: a single-row text area with the upload button (a `+` icon, accessible name "Upload file") inline on the left and the submit or stop button inline on the right. It is 52px tall when idle, against 136px for `medium`. As the user types, the text area grows to the same maximum height as `medium`, and the buttons stay on the bottom row.

All other behaviour is the same in both sizes: attachment previews, pasted images, ghost suggestions with Tab to accept, the validation error popup, the stop button while generating, disabled state, `hideFileUpload`, focus ring, Enter to submit and Shift+Enter for a new line, accessibility labels and analytics attributes. Works on web and React Native.

Fix in both sizes: the text area now re-measures its height when it gets narrower or when the web font finishes loading. Before, a message that wrapped after the first render (for example a prefilled value on a phone) could have its last line cut off.

The ChatInput knowledgebase doc covers the new prop.
