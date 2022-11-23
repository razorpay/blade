---
"@razorpay/blade": minor
---

fix: show `Spinner` on `TextInput` when `isLoading=true`
* Adds spinner when `isLoading: true` is passed to `TextInput`. This was a long pending TODO
* Update Spinner sizes after the design was updated
	*  This doesn't need any code mod since there are 9 instances of spinner being used with default variant i.e medium
