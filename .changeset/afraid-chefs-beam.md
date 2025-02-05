---
"@razorpay/blade": patch
---

fix(FileUpload): revert to not calling onChange on file remove

> [!NOTE]
>
> Check the below timeline if you're upgrading from 11.34.1+ version to this version

**Timeline of FileUpload changes**

-   In 11.34.1: We did not call onChange on removing of file. Only onRemove was called
-   In 11:36.2: We added dispatchEvent call which started calling onChange on onRemove (since React treats `input type="file"` differently than `input type="text"` - [CodeSandbox Link](https://codesandbox.io/p/sandbox/friendly-ishizaka-yk7mm3))
-   In 12.4.0: We released a fix thinking onChange call was expected behaviour and we just updated the state value for it
-   **This version:** Reverts back to 11.34.1 behaviour. If you're upgrading to this version from 11.34.1 or previous versions, the behaviour will stay same. If you're upgrading from 11.34.1+ and use FileUpload component, its recommended to test out FileUpload instances.
