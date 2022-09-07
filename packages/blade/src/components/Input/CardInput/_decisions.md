# CardInput Decisions <!-- omit in toc -->

This doc talks about the API decisions for `CardInput`. 
## Index <!-- omit in toc -->

- [CardInput API](#cardinput-api)
  - [Types of CardInput](#types-of-cardinput)
    - [Card](#card)
    - [CVV](#cvv)
    - [Expiry](#expiry)
  - [Sample Usage](#sample-usage)
- [Keyboard return key types for web and native](#keyboard-return-key-types-for-web-and-native)
- [Open questions](#open-questions)

## CardInput API

### Types of CardInput

#### Card
<img src="./card.png" width="300" alt="card input" />

#### CVV
<img src="./cvv.png" width="300" alt="cvv input" />

#### Expiry
<img src="./expiry.png" width="300" alt="card input" />

### Sample Usage

```tsx
<CardInput
  variant="card"
  label="Card Number"
  labelPosition="left"
  placeholder="xxxx  xxxx  xxxx  xxxx"
  helpText="Enter your Credit Card number"
  errorText="Invalid Card number"
  successText="Card is supported"
  validationState={inputValue.length < 10 ? 'error' : 'success'}
/>
```


| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| variant | `card`, `cvv`, `expiry` | Yes |  | Determines the variant of the input field. |
| label | `string` | Yes |  | Determines the label of the input field. Also used as `aria-label` |
| labelPosition | `top`, `left` | No | `top` | Used to identify if the label of the input field will be placed on the top of the input field or left. `left` is only available for large screen devices. When position is `left` then the width of the label is fixed to `120px` and the content is aligned left. |
| necessityIndicator | `optional`, `required` | No |  | Indicator to be shown next to the label for emphasizing the necessity of the field. if `optional` is provided then it'll show `${label} (optional)` and if `required` is provided then it'll show `${label} *` |
| name | `string` | No |  | The name of the input, [useful in form submissions](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name) |
| placeholder | `string` | No | Default to the placeholder of the variant selected | Placeholder text to be displayed inside the input field |
| value | `string` | No |  | Makes input field [controlled](https://reactjs.org/docs/forms.html#controlled-components) |
| defaultValue | `string` | No |  | Used to set the default value of input field when it's [uncontrolled](https://reactjs.org/docs/uncontrolled-components.html#default-values) controlled |
| validationState | `error` , `success`, `none` | No |  | Applies the style to the input field based on validation status and shows either `errorText` or `successText` respectively |
| helpText | `string` | No |  | Shown when we want to add some hint to the input field. Displayed under the input field. Only one of `helpText`, `errorText` or `successText` is shown at a time in the priority order as `errorText`, `successText`, `helpText` |
| errorText | `string` | No |  | Shown when the `validationState` of the input field is set to Error. Only one of `helpText`, `errorText` or `successText` is shown at a time in the priority order as `errorText`, `successText`, `helpText` |
| successText | `string` | No |  | Shown when the `validationState` of the input field is set to Success. Only one of `helpText`, `errorText` or `successText` is shown at a time in the priority order as `errorText`, `successText`, `helpText` |
| onChange | `({ name, value }) => {}` | No |  | Function called when the value of the input field changes |
| onBlur | `({ name, value }) => {}` | No |  | Function called when the input field loses focus |
| isDisabled | `boolean` | No | `false` | Marks the input field as disabled. It'll also set `aria-disabled` to true and hence the input field will loose keyboard focus. |
| isRequired | `boolean` | No | `false` | Marks the input field as required. if the errorText is provided then that will be shown if the field is required and not filled, else `${label} is required` |
| isLoading | `boolean` | No | `false` | Used to show a spinner when the the data is being loaded. **Discuss the position of the loader. Check options mentioned in the open questions below** |
| autoFocus | `boolean` | No | `false` | The autofocus global attribute is a Boolean attribute indicating that an element should be focused on page load. [Web Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autofocus), [Native Reference](https://reactnative.dev/docs/textinput#autofocus) |
| keyboardReturnKeyType. [Check this table for full reference](#keyboard-return-key-types-for-web-and-native) | `default`, `go`, `done`, `next`, `search`, `send` | No | Closest based on the `type` attribute | Determines how the return key should look on the keyboard on mobile devices or virtual keyboard |

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


## Open questions

- [ ] Should we auto-compute the Card Icon (Amex, Diners, Visa, Maestro, etc) depending on the input value?
- [ ] Should we call it `variant` or `type`?

