---
'@razorpay/blade': minor
---

feat(Ray): add Ray, Razorpay's AI mascot. On the chat input he idles, watches what's typed, looks at the pointer and flips a coin when clicked; in an answer's row he plays its states (searching, calling, writing, working). He shows how an answer ended (`outcome`: success or error), goes offline with the app (`isOffline`) and holds a mic while the page listens (`isListening` with its own `voiceStream`). Also `RayLoader`, the Ray loader (secondary): he dashes while the page loads, then slides, turns, jumps and drops through the floor (`isLoading`, `onComplete`, as RazorSenseLoader).
