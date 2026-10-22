---
'@razorpay/blade-plugin': patch
'@razorpay/blade-svelte': patch
---

docs(blade-svelte): add the `@razorpay/blade-core/styles.css` import to the setup guides

The blade-svelte skill's setup guide, the README and the Storybook installation page now import `@razorpay/blade-core/styles.css`. blade-core extracts component styles into that stylesheet, so components rendered unstyled without it.
