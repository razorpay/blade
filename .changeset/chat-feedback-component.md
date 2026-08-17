---
'@razorpay/blade': minor
---

feat(ChatFeedback): add `ChatFeedback` — a four-point rating flow for conversational surfaces: mood, follow-up tags, and an optional free-text comment. Web only for now; the native counterpart throws until it is implemented

`moodIcons` is required: Blade ships no artwork for the scale yet, so each point takes a glyph of your own — a product's icon set, or plain emoji characters. When a designed set lands, `moodIcons` becomes optional and a `moodScale` prop picks between sets, which is a non-breaking direction of travel

fix(ChatFeedback): hold the thank-you step for 1.3s before dismissing. It previously ran on `motion.delay.xgentle` (960ms), and on a strip that is also fading out the confirmation was gone before it registered

feat(ChatFeedback): closing copy now follows the mood — `moodConfig[mood].thanksLabel`, with defaults that acknowledge rather than celebrate at the unhappy end. A top-level `thanksLabel` still speaks for every mood

feat(ChatFeedback): add `onTagsChange`, `controlsRef` and `isSubmitHidden`, so a surrounding surface can collect the free-text comment in an input of its own, submit the flow from its own control, and hide the flow's tick while it does

**Breaking within this unreleased component:** the free-text `comment` step and its `Add more feedback` link are removed, along with `addCommentLabel` and `commentPlaceholder`. Free text is now the host's to collect — `ChatFeedbackProps.comment` folds it into the submit payload. `ChatFeedbackStep` loses `'comment'`

fix(ChatFeedback): report every change to the tag selection through `onTagsChange`, not only the ones made in the chip group. Picking a new mood and going back both clear the tags, and were previously silent — so a host mirroring the selection acted on tags that no longer existed

