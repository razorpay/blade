---
'@razorpay/blade': patch
---

fix: jest cannot import Blade

Jest does not support the "import" condition in exports. Changed "import" to "default".
