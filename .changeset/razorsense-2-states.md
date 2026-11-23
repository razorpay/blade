---
'@razorpay/blade': minor
'@razorpay/blade-plugin': patch
'@razorpay/blade-mcp': patch
---

feat(blade): RazorSense 2.0 states, with the same props as Ray: `isOffline` (`RazorSenseChatBackground` fades away, the chat's bottom strip drops below the page), `isListening` with the page's own `voiceStream` (the voice dashboard on a landing, the voice bottom on a chat's strip; it never opens the microphone itself) and, on `RazorSenseChat` and `RazorSenseBottomWave`, `outcome` (`'success'` or `'error'`: the strip's green or red wave, once). Each state is loaded the first time it's wanted and draws on the component's existing canvas.
