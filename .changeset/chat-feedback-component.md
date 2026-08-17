---
'@razorpay/blade': minor
---

feat(ChatFeedback): add `ChatFeedback` — a four-point rating flow for conversational surfaces: mood, follow-up tags, and an optional free-text comment. Web only for now; the native counterpart throws until it is implemented

`moodIcons` is required: Blade ships no artwork for the scale yet, so each point takes a glyph of your own — a product's icon set, or plain emoji characters. When a designed set lands, `moodIcons` becomes optional and a `moodScale` prop picks between sets, which is a non-breaking direction of travel

fix(ChatFeedback): hold the thank-you step for 1.3s before dismissing. It previously ran on `motion.delay.xgentle` (960ms), and on a strip that is also fading out the confirmation was gone before it registered
