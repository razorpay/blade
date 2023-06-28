---
"@razorpay/blade": minor
---

refactor: remove internal utilities from index re-exports

> **Warning**
>
> We have removed some of the undocumented internal utilites from re-export of `@razorpay/blade/utils`.
> We went through the imports usage of Razorpay and made sure to keep exporting the utilities that are currently being used to avoid breaking changes.
>

You can take a look at re-exports of [utils/index.ts](https://github.com/razorpay/blade/blob/master/packages/blade/src/utils/index.ts) to know which are the public utilities that we support. This is part of the larger effort in exporting and documenting useful utilities from blade and avoid exporting internal utilities which might break during internal refactors.

We have marked 2 utilities as `@deprecated` as they are expected to be internal utilities but currently being used in Razorpay. These will be removed in future major versions and won't be documented.
- `toTitleCase`
- `usePrevious`

We would recommend moving these 2 utilities to your local repo utilities.
