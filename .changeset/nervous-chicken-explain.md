---
"@razorpay/blade": minor
---

feat(Input): make `label` prop optional & add `accessibilityLabel` prop to `TextInput`, `TextArea`, `PasswordInput`, `SelectInput`, and `OTPInput` components

#### Key Updates

- **Optional `label` Prop**: We understand that not all use cases require a label for the Input components. Therefore, we have made the label prop optional, providing you with the freedom to choose whether to display a label or not, depending on your specific application requirements.

- **Introducing `accessibilityLabel`:** Recognizing the significance of accessibility in modern applications, we have added the `accessibilityLabel` prop to the Input components. This prop enables developers to assign a descriptive label for the input field, making it more user-friendly for individuals using assistive technologies or screen readers.

- **Enhanced User Guidance:** To maintain usability, we have implemented a requirement that either the `label` or `accessibilityLabel` prop must be provided. This ensures that users will always have clear guidance when interacting with Inputs, promoting a seamless user experience.
