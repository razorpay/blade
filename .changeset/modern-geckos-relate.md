---
'@razorpay/blade': patch
---

fix(FileUpload): fileupload on remove clashes with onchage

> [!NOTE]
>
> Previously, onChange did not provide an updated value when a file was removed. Now, when a file is removed from FileUpload, onChange will return the updated value.