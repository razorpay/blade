# RazorSenseSuccess (Rzp Glass Success Animation 2.0)

Success-blob's 'Success piece' as its own component: success 1's orb rises into place with its white tick, then shrinks and fades as Blade's success badge pops in where it was and the tick turns into the badge's check. Razorsensation's pack: `send/razorsense-blade/success-glass` (its README has every number); light and dark are each its own tuning.

## Why a component of its own

- `outcome` on `RazorSenseChat` plays success on the chat's strip. This is a standalone moment, where a success badge belongs (a payment received, a setup done), and it ends on Blade's own badge. The 2.0 twin of the old `RazorSense` preset `circleSlideUp`, so its story, Rzp Glass Success Animation 2.0, sits under Rzp Glass Success Animation.
- It plays once when it mounts and calls `onComplete` (as the loader does); a new `key` plays it again. No trigger prop: mounting it is the moment. In the layout it's the badge's size (80 px); the orb rises from below it, over what's there.
- Props: `accessibilityLabel` (an image named "Success"), `onComplete`, and the ones every 2.0 component takes but `scale`: the badge is Blade's true 80 px.

## How it plays

- The comp is the orb alone on its own 916 x 1692 comp px canvas. Everything else in the pack's document draws nothing (the card's field, its big bands, the strip, mattes only they used) and is dropped. Blade's engine draws it within 0.03-0.10/255 of the pack's canvas frames (mean, light and dark), both on its own ground and on a clear canvas over the page: it's drawn clear, so it sits on any page.
- The badge and tick are HTML over the canvas, from success-blob's overlay.js (`successOverlay.ts`): the tick drawn in on the orb, then turning into the check (its size, stroke, shape, colour and place) as the badge pops in on Blade's ease. Blade's tokens: the circle `feedback.background.positive.subtle`, the check `feedback.icon.positive.intense`. Once the tick is the check, Blade's own `CheckIcon` (xlarge) takes its place: the same shape (its centreline, stroke 2, round).
- The orb's canvas is 440 x 812 CSS px at 1 device px per CSS px (the orb is blurred about 100 CSS px; the tick and badge are HTML, sharp at any density). Its engine and GPU memory go as soon as the orb is gone (3.36 s); the badge stays as plain HTML.

## Still and reduced motion

- **Its still is the badge with its check: its end, in HTML.** An image of the orb would stop on a moment that never resolves; the piece's point is the badge.
- No WebGL2, a software GPU, its engine failing, or no first frame within 0.8 s (a success doesn't wait on a GPU compiling): `onError`, and the badge pops in alone with its check (the overlay with the tick off), then `onComplete`.
- Reduced motion: the badge with its check at once, and `onComplete`.

## Its label (2026-11-24)

- The user: the piece is exactly as the RazorSense system made it, and "the text there under it that comes later will be toggleable and can also be editable to whatever text. That is the component piece." So the text is the component's: `label` (any text; without it, the badge alone), Blade's large heading, 24 px (`spacing.6`) under the badge, as today's success card has it.
- Its beat: success-blob's piece has no text of its own (its page hides the chat's text while the piece plays), so the label takes its beat from the badge's, as today's success card brings its heading in after its badge: 0.3 s after the badge starts popping (2.86 s light, the same in dark), fading in and rising 20 px over 0.5 s on an ease-out. It's never shown before the orb has become the badge, and it's in its place from the start, so nothing moves when it comes in.
- Reduced motion and no WebGL2: the badge, its check and its label (at once with reduced motion; with the badge's pop where it can't animate).
- The story only sets it: its controls are the label's text and on / off.
