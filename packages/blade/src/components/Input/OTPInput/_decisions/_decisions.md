# OTPInput Decisions <!-- omit in toc -->

This doc talks about the API decisions for `OTPInput`. 
## Index <!-- omit in toc -->

- [OTPInput API](#otpinput-api)
  - [Sample Usage](#sample-usage)
- [Keyboard return key types for web and native](#keyboard-return-key-types-for-web-and-native)
- [OTP SMS auto-read feature](#otp-sms-auto-read-feature)
  - [Web](#web)
  - [Native Android](#native-android)
  - [Native iOS](#native-ios)

## OTPInput API

<img src="./otp.png" width="300" alt="otp input" />

### Sample Usage

```tsx
<OTPInput
  otpLength={6}
  label="Enter One Time Code"
  labelPosition="left"
  helpText="Enter the OTP sent to your phone number"
  errorText="Invalid OTP"
  successText="Valid OTP"
  validationState={inputValue.length < 6 ? 'error' : 'success'}
/>
```


| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| otpLength | `4`, `6`  | No | `6` | Determines the length of the OTP input. |
| label | `string` | Yes |  | Determines the label of the input field. Also used as `aria-label` |
| labelPosition | `top`, `left` | No | `top` | Used to identify if the label of the input field will be placed on the top of the input field or left. `left` is only available for large screen devices. When position is `left` then the width of the label is fixed to `120px` and the content is aligned left. |
| name | `string` | No |  | The name of the input, [useful in form submissions](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name) |
| value | `string` | No |  | Makes input field [controlled](https://reactjs.org/docs/forms.html#controlled-components) |
| validationState | `error` , `success`, `none` | No |  | Applies the style to the input field based on validation status and shows either `errorText` or `successText` respectively |
| helpText | `string` | No |  | Shown when we want to add some hint to the input field. Displayed under the input field. Only one of `helpText`, `errorText` or `successText` is shown at a time in the priority order as `errorText`, `successText`, `helpText` |
| errorText | `string` | No |  | Shown when the `validationState` of the input field is set to Error. Only one of `helpText`, `errorText` or `successText` is shown at a time in the priority order as `errorText`, `successText`, `helpText` |
| successText | `string` | No |  | Shown when the `validationState` of the input field is set to Success. Only one of `helpText`, `errorText` or `successText` is shown at a time in the priority order as `errorText`, `successText`, `helpText` |
| onChange | `({ name, value }) => {}` | No |  | Function called when the value of the input field changes |
| onOTPFilled | `({ name, value })=> {}` | No |  | Callback function when all fields of the OTPInput are filled |
| isDisabled | `boolean` | No | `false` | Marks the input field as disabled. It'll also set `aria-disabled` to true and hence the input field will loose keyboard focus. |
| autoFocus | `boolean` | No | `false` | The autofocus global attribute is a Boolean attribute indicating that an element should be focused on page load. [Web Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autofocus), [Native Reference](https://reactnative.dev/docs/textinput#autofocus) |
| keyboardReturnKeyType. [Check this table for full reference](#keyboard-return-key-types-for-web-and-native) | `default`, `go`, `done`, `next`, `search`, `send` | No | Closest based on the `type` attribute | Determines how the return key should look on the keyboard on mobile devices or virtual keyboard |
| keyboardType | `text`, `search`, `telephone`, `email`, `url`, `decimal` | No | `decimal` | Keyboard to be shown for specific input types |
| isMasked | `boolean` | No | `undefined` | Masks input characters in all the fields |

## Keyboard return key types for web and native

| Key Type            | Web                       | Native                                   |
| ------------------- | ------------------------- | ---------------------------------------- |
| <kbd>↵</kbd>        | `enterkeyhint="enter"`    | `returnKeyType="default"`                |
| <kbd>go</kbd>       | `enterkeyhint="go"`       | `returnKeyType="go"`                     |
| <kbd>Done</kbd>     | `enterkeyhint="done"`     | `returnKeyType="done"`                   |
| <kbd>Next</kbd>     | `enterkeyhint="next"`     | `returnKeyType="next"`                   |
| <kbd>Previous</kbd> | `enterkeyhint="previous"` | `returnKeyType="previous"`(android only) |
| <kbd>Search</kbd>   | `enterkeyhint="search"`   | `returnKeyType="search"`                 |
| <kbd>Send</kbd>     | `enterkeyhint="send"`     | `returnKeyType="send"`                   |


## OTP SMS auto-read feature
We've also created a [more detailed internal doc](https://docs.google.com/document/d/1y-ZXZBgxNPuIz4_7mUUoKK4YHK5f9oPzOjbfcDu4dpE) while we were exploring options for this feature.

### Web
- OTP SMS auto-read support can be added via [WebOTP API](https://web.dev/web-otp/).
- To make it work, we must set up our backend service to ensure the SMS is sent to the customer in a [specific format](https://web.dev/web-otp/#format).
- This [format differs](https://web.dev/web-otp/#use-webotp-from-a-cross-origin-iframe) if the request is coming from a cross-origin.
- Different clients could have different requirements for gracefully aborting the SMS reader function call of [`navigator.credentials.get`](https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer/get) for cases when OTP is submitted before being read by the SMS reader. We evaluated giving the consumers of blade an option to pass `AbortController` as a prop so that we give the consumers control over handling the abortion of the function.
- There are some [caveats and edge-cases](https://web.dev/web-otp/#no-dialog) within which this feature might not work as intended.
- As a conclusion, we decided to not support SMS auto-read out-of-the-box since this involves getting the product & backend teams aligned on the other aspects needed to make this feature work, the flakiness introduced by incorrect handling of `AbortController` by the consumer and the caveats and edge-cases associated with the WebOTP API itself.
- We will ensure proper annotations for the InputField that is required for the consumer to implement the feature themselves. The end-state of the OTPInputField will be such that it would allow the consumers to implement the SMS auto-read feature without any friction from Blade.

### Native Android
- Android requires us to integrate with [SMS Retriever API](https://developers.google.com/identity/sms-retriever/overview).
- To make it work, we must set up our backend service to ensure the SMS is sent to the customer in a [specific format](https://developers.google.com/identity/sms-retriever/verify#1_construct_a_verification_message) (different from the format that web requires).
- There is a library available for react native that's a wrapper around it: [react-native-otp-verify](https://github.com/faizalshap/react-native-otp-verify).
- This would require our consumers to integrate this library before they could consume the OTPInputField component.
- If certain team decides against using this feature, they might still end up being forced to install this library since our component would require it.
- There are certain edge-cases identified by our mobile teams with resending OTP which required them to call the OTP listener multiple times. To support such cases, we might need to expose the otp listener function to the consumer in some way or handle these edge-cases as they pop-up internally.
- As a conclusion, we decided to not support SMS auto-read out-of-the-box since this requires integrating an additional library for a single component whose feature may or may not be supported by the product & backend teams.
- We will ensure proper annotations for the InputField that is required for the consumer to implement the feature themselves. The end-state of the OTPInputField will be such that it would allow the consumers to implement the SMS auto-read feature without any friction from Blade.

### Native iOS
- iOS doesn't support auto-reading & auto-filling OTPs that are sent via SMS.
- Instead, iOS automatically copies the latest received OTP to the user's clipboard.
- This copied OTP is prompted to the user when the user clicks on the OTP Input Field as long as the input is annotated appropriately.
- We will ensure proper annotations for the InputField that is required for the consumer to implement the feature themselves. The end-state of the OTPInputField will be such that it would allow the consumers to implement the SMS auto-read feature without any friction from Blade.
