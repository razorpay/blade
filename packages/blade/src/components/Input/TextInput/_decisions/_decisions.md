# Input Decisions <!-- omit in toc -->

This doc talks about the API decisions for `TextInput` element. The `TextInput` extends the `BaseInput`. Most of the heavy lifting is done by `BaseInput` field

## Index <!-- omit in toc -->

- [TextInput API](#textinput-api)
- [Web \& React Native Attributes for showing keyboard types and autocomplete suggestions based on input `type` attribute](#web--react-native-attributes-for-showing-keyboard-types-and-autocomplete-suggestions-based-on-input-type-attribute)
- [Keyboard return key types for web and Native](#keyboard-return-key-types-for-web-and-native)
- [Notes](#notes)
- [Open questions](#open-questions)
- [Discussion Notes](#discussion-notes)
  - [Actionables for Design based on discussions on 21-07-2022](#actionables-for-design-based-on-discussions-on-21-07-2022)
- [References](#references)

## TextInput API

**Sample Usage**

```tsx
<TextInput
  label="Enter Name"
  labelPosition="left"
  placeholder="Enter your name"
  icon={UserIcon}
  showClearButton={true}
  helpText="Enter first name and last name. Eg: Kamlesh Chandnani"
  errorText="Name cannot be blank"
  successText="Name validated"
  validationState={inputValue.length < 10 ? 'error' : 'success'}
/>
```

The mobile keyboard type will be automatically determined based on the `type` attribute. Check out [Web & React Native Attributes for showing keyboard types and autocomplete suggestions based on input](#web--react-native-attributes-for-showing-keyboard-types-and-autocomplete-suggestions-based-on-input-type-attribute) section for more details

| Prop                                                                                                        | Type                                                                         | Required | Default                                                   | Description                                                                                                                                                                                                                                                                           |
| ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| label                                                                                                       | `string`                                                                     | Yes      |                                                           | Determines the label of an input field. Also used as `aria-label`                                                                                                                                                                                                                     |
| labelPosition                                                                                               | `top`, `left`                                                                | No       | `top`                                                     | Used to identify if the label of the input field will be placed on the top of the input field or left. `left` is only available for large screen devices. When position is `left` then the width of the label is fixed to `120px` and the content is aligned left.                    |
| necessityIndicator                                                                                          | `optional`, `required`                                                       | No       |                                                           | Indicator to be shown next to the label for emphasizing the necessity of the field. if `optional` is provided then it'll show `${label} (optional)` and if `required` is provided then it'll show `${label} *`                                                                        |
| name                                                                                                        | `string`                                                                     | No       |                                                           | The name of the checkbox group, [useful in form submissions](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name)                                                                                                                                                    |
| type                                                                                                        | `text`, `search`, `telephone`, `email`, `url`, `number`                      | No       | `text`                                                    | type of text to be rendered. this will also determine the keyboard type to be show on mobile devices                                                                                                                                                                                  |
| placeholder                                                                                                 | `string`                                                                     | No       | Default to the label if label provided else `Enter Value` | Placeholder text to be displayed inside the input field                                                                                                                                                                                                                               |
| value                                                                                                       | `string`                                                                     | No       |                                                           | Makes input field [controlled](https://reactjs.org/docs/forms.html#controlled-components)                                                                                                                                                                                             |
| defaultValue                                                                                                | `string`                                                                     | No       |                                                           | Used to set the default value of input field when it's [uncontrolled](https://reactjs.org/docs/uncontrolled-components.html#default-values) controlled                                                                                                                                |
| validationState                                                                                             | `error` , `success`, `none`                                                  | No       |                                                           | Applies the style to the input field based on validation status and shows either `errorText` or `successText` respectively                                                                                                                                                            |
| helpText                                                                                                    | `string`                                                                     | No       |                                                           | Shown when we want to add some hint to the input field. Displayed under the input field. Only one of `helpText`, `errorText` or `successText` is shown at a time in the priority order as `errorText`, `successText`, `helpText`                                                      |
| errorText                                                                                                   | `string`                                                                     | No       |                                                           | Shown when the `validationState` of the input field is set to Error. Only one of `helpText`, `errorText` or `successText` is shown at a time in the priority order as `errorText`, `successText`, `helpText`                                                                          |
| successText                                                                                                 | `string`                                                                     | No       |                                                           | Shown when the `validationState` of the input field is set to Success. Only one of `helpText`, `errorText` or `successText` is shown at a time in the priority order as `errorText`, `successText`, `helpText`                                                                        |
| onChange                                                                                                    | `({ name, value }) => {}`                                                    | No       |                                                           | Function called when the value of the input field changes                                                                                                                                                                                                                             |
| onBlur                                                                                                      | `({ name, value }) => {}`                                                    | No       |                                                           | Function called when the input field receives focus                                                                                                                                                                                                                                   |
| onBlur                                                                                                      | `({ name, value }) => {}`                                                    | No       |                                                           | Function called when the input field loses focus                                                                                                                                                                                                                                      |
| isDisabled                                                                                                  | `boolean`                                                                    | No       | `false`                                                   | Marks the input field as disabled. It'll also set `aria-disabled` to true and hence the input field will loose keyboard focus.                                                                                                                                                        |
| isRequired                                                                                                  | `boolean`                                                                    | No       | `false`                                                   | Marks the input field as required. if the errorText is provided then that will be shown if the field is required and not filled, else `${label} is required`                                                                                                                          |
| icon                                                                                                        | `Icon`                                                                       | No       |                                                           | Icon to be displayed at the start of the input field.                                                                                                                                                                                                                                 |
| showClearButton                                                                                             | `boolean`                                                                    | No       | `false`                                                   | Defines if we want to show the clear icon button on the right side of the input field                                                                                                                                                                                                 |
| onClearButtonClicked                                                                                        | `(event) => {}`                                                              | No       |                                                           | Used in conjunction with `showClearButton` prop. Provides the capability to the user to handle/control the behavior of clear icon button. Can be used to send analytics event and can also be used to clear the content when the input field is `controlled`                          |
| prefix                                                                                                      | `string`                                                                     | No       |                                                           | Used when we want to add prefix to the input field. Eg: `$` or `₹`. The prefix will be placed **after** `icon`                                                                                                                                                                        |
| suffix                                                                                                      | `string`                                                                     | No       |                                                           | Used when we want to add suffix to the input field. Eg: `.00` or `@gmail.com`. If `showClearButton` is `true` then suffix will be placed **after** clear button.                                                                                                                      |
| isLoading                                                                                                   | `boolean`                                                                    | No       | `false`                                                   | Used to show a spinner when the the data is being loaded. **Discuss the position of the loader. Check options mentioned in the open questions below**                                                                                                                                 |
| maxCharacters                                                                                               | `number`                                                                     | No       |                                                           | Used to show a character counter under the input field                                                                                                                                                                                                                                |
| autoFocus                                                                                                   | `boolean`                                                                    | No       | `false`                                                   | The autofocus global attribute is a Boolean attribute indicating that an element should be focused on page load. [Web Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autofocus), [Native Reference](https://reactnative.dev/docs/textinput#autofocus) |
| autoCompleteSuggestionType                                                                                  | `name`, `email`, `countryName`, `postalCode`,`telephone`, `username`, `none` | No       |                                                           | Specifies autocomplete hints for the system, so it can provide autofill                                                                                                                                                                                                               |
| keyboardReturnKeyType. [Check this table for full reference](#keyboard-return-key-types-for-web-and-native) | `default`, `go`, `done`, `next`, `search`, `send`                            | No       | Closest based on the `type` attribute                     | Determines how the return key should look on the keyboard on mobile devices or virtual keyboard                                                                                                                                                                                       |

## Web & React Native Attributes for showing keyboard types and autocomplete suggestions based on input `type` attribute

- The keyboard type will be automatically decided based on the `type` attribute defined by the user.
- Based on the `type` attribute we'll also try to decide the type of autocomplete suggestion, but it can be overridden to make it more specific based on consumer's use cases. For eg: the plain text field can be used for many purpose and the consumer might need control over `autocomplete` suggestions to be displayed based on the context its used in.
- Based on the `type` attribute we'll also determine the `keyboardReturnKeyType` but again this can be fine tuned by the consumers based on the contextual use cases.

| type   | web attributes                                                                                                                                                                          | react-native attributes                                                                |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| text   | `inputmode="text"`, `autocomplete="off"`(can be set to valid options for autocomplete based on the context where the plain text is being use for eg: `name`,`username`,`country`, etc.) | `keyboardType="default"`                                                               |
| search | `inputmode="search"`, `autocomplete="off"`(can give option to consumer to configure this with more options which are contextual), `enterkeyhint="search"`                               | `keyboardType="default"`, `returnKeyType="search"`                                     |
| tel    | `inputmode="tel"`, `autocomplete="tel"`, `enterkeyhint="done"`(can be overridden by consumers)                                                                                          | `keyboardType="phone-pad"`, `returnKeyType="done"`(can be overridden by consumers)     |
| email  | `inputmode="email"`, `autocomplete="email"`, `enterkeyhint="done"`(can be overridden by consumers)                                                                                      | `keyboardType="email-address"`, `returnKeyType="done"`(can be overridden by consumers) |
| url    | `inputmode="url"`, `autocomplete="off"`, `enterkeyhint="done"`(can be overridden by consumers)                                                                                          | `keyboardType="url"`, `returnKeyType="done"`(can be overridden by consumers)           |
| number | `type="text"`, `inputmode="decimal"`, `autocomplete="off"`, `enterkeyhint="done"`(can be overridden by consumers)                                                                       | `keyboardType="decimal-pad"`, `returnKeyType="done"`(can be overridden by consumers)   |

## Keyboard return key types for web and Native

| Key Type            | Web                       | Native                                   |
| ------------------- | ------------------------- | ---------------------------------------- |
| <kbd>↵</kbd>        | `enterkeyhint="enter"`    | `returnKeyType="default"`                |
| <kbd>go</kbd>       | `enterkeyhint="go"`       | `returnKeyType="go"`                     |
| <kbd>Done</kbd>     | `enterkeyhint="done"`     | `returnKeyType="done"`                   |
| <kbd>Next</kbd>     | `enterkeyhint="next"`     | `returnKeyType="next"`                   |
| <kbd>Previous</kbd> | `enterkeyhint="previous"` | `returnKeyType="previous"`(android only) |
| <kbd>Search</kbd>   | `enterkeyhint="search"`   | `returnKeyType="search"`                 |
| <kbd>Send</kbd>     | `enterkeyhint="send"`     | `returnKeyType="send"`                   |

## Notes

Reusable components candidate

- label
- helpText/errorText/successText
- character counter(only input field)
- clear icon button
- prefix/suffix

## Open questions

- [ ] Do we need to expose `autoCapitalize` for native?
  - confirm once with mobile devs. design side we shall not touch this
- [ ] Do we need to expose `onSubmitEditing` for native?
- [ ] Do we need to fix the height for reserving space for help/error/success text?
  - Pending on design, Saurav to visually test this
- [x] Do we have icon which is clickable so we can put it under textfield?
  - We don't have need to create one
- [x] motion for the textfield animation in active state
- [x] Do we have a usecase of using textfield without label or form level things?
  - Not right now. we'll mark label as required field for now
- [x] fullWidth input field do we have a use case?
  - TextField will always be 100% width of the container
- [x] textContentType for autocomplete on native ios only
  - https://reactnative.dev/docs/textinput#textcontenttype-ios
  - added a prop `autofillSuggestionType` which will work cross platform
- [x] what is the default position for loader in loading state? following are some options

  - based on icon prop
  - based on clearbutton
  - leave this decision upto consumer
  - fix it either on left/right
  - **Conclusion**: fix it on right always. basically all the actionables for input field will always be on the right side(clear, showPassword)

- [x] Do we need leading and trailing both icons? or we shall just accept an `icon` prop and then decide the position internally?
  - **Conclusion**: We shall just accept `icon` prop and we'll always fix the position on the left internally. This will visually bring in consistency when multiple input fields are placed in one form.
- [x] Do we have a use case to show clear button in case of password field?
  - yes. the clear button will be shown before the show password button.
- [x] returnKeyType native - native
  - enterkeyhint - web
- [x] Do we need link? what is the use case?
  - NA
- [x] How to handle the view layout changes on mobile when the keyboard appears so the input doesn't moves out of the view
  - accept and pass ref
- [x] `textAlign` on native need to be exposed?
  - yes might be required for OTP
- [x] multiline error messages?
  - deferred for now until we have a use case for it
- [x] Do we need to show errorText/successText along with helpText or only one of them can be shown at a time?

  - only one at a time in the priority errorText > successText > helpText

- [x] `readonly` need to be supported? or just disabled? or both?

  - Using the disabled prop will prevent the text field from receive keyboard focus or inputs
  - The readOnly prop allows focus on the text field but prevents input or editing
  - We'll right now just go with disabled prop

- [x] labelAlignment - do we need to give this option? if no, then what is the default alignment when the position is left? -

  - always left aligned

- [x] do we need a trailingIconClick? what if we provide clear button and the onClick for that and then only have leading and trailing props which can accept text as well as icon?

  - added `showClearButton` prop along with `onClearButtonClick` handler

## Discussion Notes

### Actionables for Design based on discussions on 21-07-2022

- Action items from discussion(21-07-22)
- Add isLoading prop for the plain input field
- Rename leadingIcon to just icon and fix the position to the left
- Remove trailingIcon and update the docs
- Add clear button component
- Add a prop call showClearButton which will display clear button
- Add necessity indicator prop to all the input fields. if `optional` is provided then it'll show `${label} (optional)` and if `required` is provided then it'll show `${label} *`
- create prefix and suffix props for plain text field
- update docs for keyboard interaction for different input types for mobile. refer https://github.com/razorpay/blade/blob/feat/input-field/packages/blade/src/components/Input/_decisions/decisions.md#web--react-native-attributes-for-showing-keyboard-types-and-autocomplete-suggestions-based-on-input
- add autofillSuggestionType to docs to show how to guide browsers to show the correct autofill suggestions both on desktop and mobile platforms
- add validationState: none | error | success
- visually test if we want to reserve space for help/error/success text to avoid the layout content shift

## References

- Keyboard
  - web
    - attributes: `type`, `inputmode`, `autocomplete`, `keyboardhint`
    - [Blog diff keyboard types and autosuggestion](https://css-tricks.com/better-form-inputs-for-better-mobile-user-experiences/)
    - [Demo of diff keyboard types and autosuggestion](https://better-mobile-inputs.netlify.app/)
    - [`autocomplete`](https://polaris.shopify.com/components/text-field)
    - [`enterkeyhint` demo-1](https://mixable.blog/ux-improvements-enterkeyhint-to-define-action-label-for-the-keyboard-of-mobile-devices/)
    - [`enterkeyhint` demo-2](https://dtapuska.github.io/enterkeyhint/)
    - [`enterkeyhint` ref](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/enterkeyhint)
  - native
    - [`keyboardType`](https://reactnative.dev/docs/textinput#keyboardtype)
    - [`returnKeyType`](https://reactnative.dev/docs/textinput#returnkeytype)
- [List of autocomplete suggestions across platform](https://docs.google.com/spreadsheets/d/1y6Za5jUA2CnLwPZuMs6zogqPGG8GJhonkhPpgRBvZS0/edit?usp=sharing)
