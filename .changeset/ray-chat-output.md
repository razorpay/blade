---
'@razorpay/blade': minor
'@razorpay/blade-plugin': patch
'@razorpay/blade-mcp': patch
---

feat(RayChatOutput): add `RayChatOutput` and `rayChatOutputGenUI`

Draws RAY's chat text (an AI assistant's Markdown reply) the way RAY's chat looks, all on Blade tokens:
- the opening paragraph (the answer) as the main title, decided on the first block, so a streaming reply never jumps;
- TASA Orbiter 20/26 titles;
- Inter 14/24 body and 14/26 lists;
- 12 / 16 / 24 gaps.

It tidies RAY's JSON wrapper, literal `\n` and emoji before drawing. `rayChatOutputGenUI` makes GenUI draw its `TEXT` this way. Web only.
