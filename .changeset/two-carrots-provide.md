---
'@razorpay/blade': patch
---

fix: change import to default in package exports

Jest does not support the "import" condition in exports. This was causing tests to fail for Blade consumers. Changed "import" to "default" which is supported by all tools. Since Blade is not exporting a dual package, we don't need the "import" condition.
