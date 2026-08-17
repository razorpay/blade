---
'@razorpay/blade': minor
---

feat(ChatInput): add `feedback` — attaches a `ChatFeedback` prompt to the top edge of the composer, on a tinted surface that holds the two together as one object. Web only. Omit the prop and the composer renders exactly as it does today; the surface is only drawn while the prompt is showing

fix(ChatInput): dissolve the attached surface instead of dropping it. Background and padding now transition on the same beat as the prompt's fade, so the composer no longer jumps up by the padding at the moment the confirmation leaves

feat(ChatInput): picking the feedback prompt's free-text tag hands the composer over — placeholder swaps, a dismissable `Feedback` tag replaces the upload link, focus moves to the field, and Enter submits the comment. Configurable with `feedback.freeTextTag` (default `'Other'`) and `feedback.commentPlaceholder`

The chat submit path is blocked while that mode is on rather than redirected: sending someone's candid feedback to the assistant as a prompt is not a recoverable mistake. Anything already typed for the chat is stashed and restored on the way out, and every exit — Esc, the tag's dismiss, submitting, deselecting the tag, or the prompt going away — also releases the tag, so nobody is left holding a choice with no way to send it

