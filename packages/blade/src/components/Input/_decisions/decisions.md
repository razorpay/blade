# Input Decisions <!-- omit in toc -->

- [Design](#design)
- [BaseInputField API](#baseinputfield-api)
- [TextInput API](#textinput-api)
  - [Web & React Native Attributes for showing keyboard types and autocomplete suggestions based on input](#web--react-native-attributes-for-showing-keyboard-types-and-autocomplete-suggestions-based-on-input)
  - [Return Key types for web and Native](#return-key-types-for-web-and-native)
- [PasswordInput](#passwordinput)
- [Notes](#notes)
- [Open questions](#open-questions)
- [References](#references)

## Design

- [TextInput](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=10953%3A191574)
- [PasswordInput](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=10953%3A180381)
- [OTPInput]()
- [CardInput]()
- [TextArea]()

## BaseInputField API

## TextInput API

**Sample Usage**

```tsx
<TextInput
  label="Enter Name"
  labelPosition="left"
  placeholder="Enter your name"
  leadingIcon={UserIcon}
  showClearButton
  helpText="Enter first name and last name. Eg: Kamlesh Chandnani"
  errorText="Name cannot be blank"
  successText="Name validated"
  validationState={inputValue.length < 10 ? 'error' : 'success'}
/>
```

The mobile keyboard type will be automatically determined based on the `type` attribute. Check out [Web & React Native Attributes for showing keyboard types and autocomplete suggestions based on input](#web--react-native-attributes-for-showing-keyboard-types-and-autocomplete-suggestions-based-on-input) section for more details

| Prop                                                                                               | Type                                                                      | Required                                                                            | Default                                                   | Description                                                                                                                                                                                                                                                                           |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type                                                                                               | `text`, `search`, `tel`, `email`, `url`, `numeric`                        | No                                                                                  | `text`                                                    | type of text to be rendered. this will also determine the keyboard type to be show on mobile devices                                                                                                                                                                                  |
| label                                                                                              | `string`                                                                  | (confirm if we have a use case for input field without labels(search field maybe?)) |                                                           | Determines the label of an input field. Also used as `aria-label`                                                                                                                                                                                                                     |
| labelPosition                                                                                      | `top`, `left`                                                             | No                                                                                  | `top`                                                     | Used to identify if the label of the input field will be placed on the top of the input field or left                                                                                                                                                                                 |
| placeholder                                                                                        | `string`                                                                  | No                                                                                  | Default to the label if label provided else `Enter Value` | Placeholder text to be displayed inside the input field                                                                                                                                                                                                                               |
| value                                                                                              | `string`                                                                  | No                                                                                  |                                                           | Makes input field [controlled](https://reactjs.org/docs/forms.html#controlled-components)                                                                                                                                                                                             |
| onChange                                                                                           | `({ event, name, value }) => {}`                                          | No                                                                                  |                                                           | Function called when the value of the input field changes                                                                                                                                                                                                                             |
| onBlur                                                                                             | `({ event, name, value }) => {}`                                          | No                                                                                  |                                                           | Function called when the input field loses focus                                                                                                                                                                                                                                      |
| isDisabled                                                                                         | `boolean`                                                                 | No                                                                                  | `false`                                                   | Marks the input field as disabled. It'll also loose keyboard focus.                                                                                                                                                                                                                   |
| leadingIcon                                                                                        | `Icon`                                                                    | No                                                                                  |                                                           | Icon to be displayed at the start of the input field.                                                                                                                                                                                                                                 |
| trailingIcon                                                                                       | `Icon`                                                                    | No                                                                                  |                                                           | Icon to be displayed at the end of the input field. This prop limits to only display Icon, things like some suffix eg: `.00` or `@gmail.com` won't be supported. Discuss this                                                                                                         |
| showClearButton                                                                                    | `boolean`                                                                 | No                                                                                  | `false`                                                   | Defines if we want to show the clear icon button on the right side of the input field                                                                                                                                                                                                 |
| onClearButtonClicked                                                                               | `(event) => {}`                                                           | No                                                                                  |                                                           | Used in conjunction with `showClearButton` prop. Provides the capability to the user to handle/control the behavior of clear icon button. Can be used to send analytics event and can also be used to clear the content when the input field is `controlled`                          |
| prefixContent                                                                                      | `string`                                                                  | No                                                                                  |                                                           | Used when we want to add prefix to the input field. Eg: `$` or `₹`. The prefix will be placed after `leadingIcon`                                                                                                                                                                     |
| suffixContent                                                                                      | `string`                                                                  | No                                                                                  |                                                           | Used when we want to add suffix to the input field. Eg: `.00` or `@gmail.com`. If `showClearButton` is `true` then suffix will be placed before clear button. If trailing icon is provided then suffix will be placed before trailing icon(**Discuss if this is possible**)           |
| isLoading                                                                                          | `boolean`                                                                 | No                                                                                  | `false`                                                   | Used to show a spinner when the the data is being loaded. **Discuss the position of the loader. Check options mentioned in the open questions below**                                                                                                                                 |
| maxCharacters                                                                                      | `number`                                                                  | No                                                                                  |                                                           | Used to show a character counter under the input field                                                                                                                                                                                                                                |
| validationState                                                                                    | `error` , `success`                                                       | No                                                                                  |                                                           | Applies the style to the input field based on validation status and shows either `errorText` or `successText` respectively                                                                                                                                                            |
| helpText                                                                                           | `string`                                                                  | No                                                                                  |                                                           | Shown when we want to add some hint to the input field. Displayed under the input field. Only one of `helpText`, `errorText` or `successText` is shown at a time in the priority order as `errorText`, `successText`, `helpText`                                                      |
| errorText                                                                                          | `string`                                                                  | No                                                                                  |                                                           | Shown when the `validationState` of the input field is set to Error. Only one of `helpText`, `errorText` or `successText` is shown at a time in the priority order as `errorText`, `successText`, `helpText`                                                                          |
| successText                                                                                        | `string`                                                                  | No                                                                                  |                                                           | Shown when the `validationState` of the input field is set to Success. Only one of `helpText`, `errorText` or `successText` is shown at a time in the priority order as `errorText`, `successText`, `helpText`                                                                        |
| autoFocus                                                                                          | `boolean`                                                                 | No                                                                                  | `false`                                                   | The autofocus global attribute is a Boolean attribute indicating that an element should be focused on page load. [Web Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autofocus), [Native Reference](https://reactnative.dev/docs/textinput#autofocus) |
| fullWidth                                                                                          | `boolean`                                                                 | No                                                                                  | `false`                                                   | **Discuss if we want to add support for full-width input fields.**                                                                                                                                                                                                                    |
| autofillSuggestionType                                                                             | `name`, `email`, `countryName`,`postalCode`,`telephone`,`username`,`none` | No                                                                                  |                                                           | Specifies autocomplete hints for the system, so it can provide autofill                                                                                                                                                                                                               |
| keyboardReturnKeyType. [Check this table for full reference](#return-key-types-for-web-and-native) | `go`, `done`, `next`, `search`, `send`                                    | No                                                                                  | Closest based on the `type` attribute                     | Determines how the return key should look on the keyboard on mobile devices or virtual keyboard                                                                                                                                                                                       |

### Web & React Native Attributes for showing keyboard types and autocomplete suggestions based on input

- The keyboard type will be automatically decided based on the `type` attribute defined by the user.
- Based on the `type` attribute we'll also try to decide the type of autocomplete suggestion, but it can be overriden to make it more specific based on consumer's use cases. For eg: the plain text field can be used for many purpose and the consumer might need control over `autocomplete` suggestions to be displayed based on the context its used in.
- Based on the `type` attribute we'll also determine the `keyboardReturnKeyType` but again this can be fine tuned by the consumers based on the contextual use cases.

| type    | web attributes                                                                                                                                                                          | react-native attributes                                                               |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| text    | `inputmode="text"`, `autocomplete="off"`(can be set to valid options for autocomplete based on the context where the plain text is being use for eg: `name`,`username`,`country`, etc.) | `keyboardType="default"`                                                              |
| search  | `inputmode="search"`, `autocomplete="off"`(can give option to consumer to configure this with more options which are contextual), `enterkeyhint="search"`                               | `keyboardType="default"`, `returnKeyType="search"`                                    |
| tel     | `inputmode="tel"`, `autocomplete="tel"`, `enterkeyhint="done"`(can be overriden by consumers)                                                                                           | `keyboardType="phone-pad"`, `returnKeyType="done"`(can be overriden by consumers)     |
| email   | `inputmode="email"`, `autocomplete="email"`, `enterkeyhint="done"`(can be overriden by consumers)                                                                                       | `keyboardType="email-address"`, `returnKeyType="done"`(can be overriden by consumers) |
| url     | `inputmode="url"`, `autocomplete="off"`, `enterkeyhint="done"`(can be overriden by consumers)                                                                                           | `keyboardType="url"`, `returnKeyType="done"`(can be overriden by consumers)           |
| numeric | `type="text"`, `inputmode="decimal"`, `autocomplete="off"`, `enterkeyhint="done"`(can be overriden by consumers)                                                                        | `keyboardType="decimal-pad"`, `returnKeyType="done"`(can be overriden by consumers)   |

### Return Key types for web and Native

| Key Type            | Web                       | Native                                   |
| ------------------- | ------------------------- | ---------------------------------------- |
| <kbd>↵</kbd>        | `enterkeyhint="enter"`    | NA                                       |
| <kbd>go</kbd>       | `enterkeyhint="go"`       | `returnKeyType="go"`                     |
| <kbd>Done</kbd>     | `enterkeyhint="done"`     | `returnKeyType="done"`                   |
| <kbd>Next</kbd>     | `enterkeyhint="next"`     | `returnKeyType="next"`                   |
| <kbd>Previous</kbd> | `enterkeyhint="previous"` | `returnKeyType="previous"`(android only) |
| <kbd>Search</kbd>   | `enterkeyhint="search"`   | `returnKeyType="search"`                 |
| <kbd>Send</kbd>     | `enterkeyhint="send"`     | `returnKeyType="send"`                   |

## PasswordInput

**Sample Usage**

```tsx
<PasswordInput
  label="Enter Password"
  labelPosition="top"
  placeholder="Enter your password"
  errorText="Password cannot be blank"
  validationState={!inputValue.length ? 'error' : undefined}
/>
```

| Prop                                                                                               | Type                              | Required                                                                            | Default                                                   | Description                                                                                                                                                                                                                                                                           |
| -------------------------------------------------------------------------------------------------- | --------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| label                                                                                              | `string`                          | (confirm if we have a use case for input field without labels(search field maybe?)) |                                                           | Determines the label of an input field. Also used as `aria-label`                                                                                                                                                                                                                     |
| labelPosition                                                                                      | `top`, `left`                     | No                                                                                  |                                                           | Used to identify if the label of the input field will be placed on the top of the input field or left                                                                                                                                                                                 |
| placeholder                                                                                        | `string`                          | No                                                                                  | Default to the label if label provided else `Enter Value` | Placeholder text to be displayed inside the input field                                                                                                                                                                                                                               |
| value                                                                                              | `string`                          | No                                                                                  |                                                           | Makes input field [controlled](https://reactjs.org/docs/forms.html#controlled-components)                                                                                                                                                                                             |
| onChange                                                                                           | `({ event, name, value }) => {}`  | No                                                                                  |                                                           | Function called when the value of the input field changes                                                                                                                                                                                                                             |
| onBlur                                                                                             | `({ event, name, value }) => {}`  | No                                                                                  |                                                           | Function called when the input field loses focus                                                                                                                                                                                                                                      |
| isDisabled                                                                                         | `boolean`                         | No                                                                                  | `false`                                                   | Marks the input field as disabled. It'll also loose keyboard focus.                                                                                                                                                                                                                   |
| showClearButton                                                                                    | `boolean`                         | No                                                                                  | `false`                                                   | Defines if we want to show the clear icon button on the right side of the password field                                                                                                                                                                                              |
| onClearButtonClicked                                                                               | `(event) => {}`                   | No                                                                                  |                                                           | Used in conjunction with `showClearButton` prop. Provides the capability to the user to handle/control the behavior of clear icon button. Can be used to send analytics event and can also be used to clear the content when the input field is `controlled`                          |
| maxCharacters                                                                                      | `number`                          | No                                                                                  |                                                           | Used to show a character counter under the input field                                                                                                                                                                                                                                |
| validationState                                                                                    | `error` , `success`               | No                                                                                  |                                                           | Applies the style to the input field based on validation status and shows either `errorText` or `successText` respectively                                                                                                                                                            |
| helpText                                                                                           | `string`                          | No                                                                                  |                                                           | Shown when we want to add some hint to the input field. Displayed under the input field. Only one of `helpText`, `errorText` or `successText` is shown at a time in the priority order as `errorText`, `successText`, `helpText`                                                      |
| errorText                                                                                          | `string`                          | No                                                                                  |                                                           | Shown when the `validationState` of the input field is set to Error. Only one of `helpText`, `errorText` or `successText` is shown at a time in the priority order as `errorText`, `successText`, `helpText`                                                                          |
| successText                                                                                        | `string`                          | No                                                                                  |                                                           | Shown when the `validationState` of the input field is set to Success. Only one of `helpText`, `errorText` or `successText` is shown at a time in the priority order as `errorText`, `successText`, `helpText`                                                                        |
| autoFocus                                                                                          | `boolean`                         | No                                                                                  | `false`                                                   | The autofocus global attribute is a Boolean attribute indicating that an element should be focused on page load. [Web Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autofocus), [Native Reference](https://reactnative.dev/docs/textinput#autofocus) |
| fullWidth                                                                                          | `boolean`                         | No                                                                                  | `false`                                                   | **Discuss if we want to add support for full-width input fields.**                                                                                                                                                                                                                    |
| autofillSuggestionType                                                                             | `password`, `passwordNew`, `none` | No                                                                                  |                                                           | Specifies autocomplete hints for the system, so it can provide autofill                                                                                                                                                                                                               |
| keyboardReturnKeyType. [Check this table for full reference](#return-key-types-for-web-and-native) | `go`, `done`, `next`, `send`      | No                                                                                  | Closest based on the `type` attribute                     | Determines how the return key should look on the keyboard on mobile devices or virtual keyboard                                                                                                                                                                                       |

## Notes

Reusable components candidate

- label
- helpText/errorText/successText
- character counter(only input field)
- clear icon button
- prefix/suffix

## Open questions

- [ ] Do we have a usecase of using textfield without label or form level things?
- [ ] Do we need to expose `autoCapitalize` for native?
- [ ] Do we need to expose `onSubmitEditing` for native?
- [ ] Do we need to fix the height for reserving space for help/error/success text?
- [ ] motion for the textfield animation in active state
- [ ] fullWidth inputField do we have a use case?
- [ ] textContentType for autocomplete on native ios only
  - https://reactnative.dev/docs/textinput#textcontenttype-ios
- [ ] what is the default position for loader in loading state? following are some options

  - based on icon prop
  - based on clearbutton
  - leave this decision upto consumer
  - fix it either on left/right

- [ ] Do we have icon which is clickable so we can put it under textfield?
  - We don't have need to create one
- [ ] Do we have a use case to show clear button in case of password field?
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

TODO:

- Define basetext field with all P&C
- Define plain input - done
- define password input - done
- keyboard type maps for web and native - done
- define a11y -- defer
- open questions from Saurav
