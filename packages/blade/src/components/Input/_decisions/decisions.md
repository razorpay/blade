# Input Decisions <!-- omit in toc -->

- [Design](#design)
- [BaseInputField API](#baseinputfield-api)
- [TextInput API](#textinput-api)
- [Open questions](#open-questions)

## Design

[Figma Link](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=10953%3A191574)

## BaseInputField API

## TextInput API

| Prop                                                              | Type                                                          | Required                                                                            | Default                                                   | Description                                                                                                                                                                                                                                                                           |
| ----------------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| label                                                             | `string`                                                      | (confirm if we have a use case for input field without labels(search field maybe?)) |                                                           | Determines the label of an input field. Also used as `aria-label`                                                                                                                                                                                                                     |
| labelPosition                                                     | `top`, `left`                                                 | No                                                                                  | `top`                                                     | Used to identify if the label of the input field will be placed on the top of the input field or left                                                                                                                                                                                 |
| placeholder                                                       | `string`                                                      | No                                                                                  | Default to the label if label provided else `Enter Value` | Defines the placeholder text to be displayed inside the input field                                                                                                                                                                                                                   |
| value                                                             | `string`                                                      | No                                                                                  |                                                           | Makes input field [controlled](https://reactjs.org/docs/forms.html#controlled-components)                                                                                                                                                                                             |
| onChange                                                          | `({ event, name, value }) => {}`                              | No                                                                                  |                                                           | Function called when the value of the input field changes                                                                                                                                                                                                                             |
| onBlur                                                            | `({ event, name, value }) => {}`                              | No                                                                                  |                                                           | Function called when the input field loses focus                                                                                                                                                                                                                                      |
| isDisabled                                                        | `boolean`                                                     | No                                                                                  | `false`                                                   | Marks the input field as disabled. It'll also loose keyboard focus.                                                                                                                                                                                                                   |
| leadingIcon                                                       | `Icon`                                                        | No                                                                                  |                                                           | Icon to be displayed at the start of the input field.                                                                                                                                                                                                                                 |
| trailingIcon                                                      | `Icon`                                                        | No                                                                                  |                                                           | Icon to be displayed at the end of the input field. This prop limits to only display Icon, things like some suffix eg: `.00` or `@gmail.com` won't be supported. Discuss this                                                                                                         |
| showClearButton                                                   | `boolean`                                                     | No                                                                                  | `false`                                                   | Defines if we want to show the clear icon button on the right side of the input field                                                                                                                                                                                                 |
| onClearButtonClicked                                              | `(event) => {}`                                               | No                                                                                  |                                                           | Used in conjunction with `showClearButton` prop. Provides the capability to the user to handle/control the behavior of clear icon button. Can be used to send analytics event and can also be used to clear the content when the input field is `controlled`                          |
| prefixContent                                                     | `string`                                                      | No                                                                                  |                                                           | Used when we want to add prefix to the input field. Eg: `$` or `₹`. The prefix will be placed after `leadingIcon`                                                                                                                                                                     |
| suffixContent                                                     | `string`                                                      | No                                                                                  |                                                           | Used when we want to add suffix to the input field. Eg: `.00` or `@gmail.com`. If `showClearButton` is `true` then suffix will be placed before clear button. If trailing icon is provided then suffix will be placed before trailing icon(**Discuss if this is possible**)           |
| isLoading                                                         | `boolean`                                                     | No                                                                                  | `false`                                                   | Used to show a spinner when the the data is being loaded. **Discuss the position of the loader. Check options mentioned in the open questions below**                                                                                                                                 |
| maxCharacters                                                     | `number`                                                      | No                                                                                  |                                                           | Used to show a character counter under the input field                                                                                                                                                                                                                                |
| validationState                                                   | `error` , `success`                                           | No                                                                                  |                                                           | Applies the style to the input field based on validation status and shows either `errorText` or `successText` respectively                                                                                                                                                            |
| helpText                                                          | `string`                                                      | No                                                                                  |                                                           | Shown when we want to add some hint to the input field. Displayed under the input field. Only one of `helpText`, `errorText` or `successText` is shown at a time in the priority order as `errorText`, `successText`, `helpText`                                                      |
| errorText                                                         | `string`                                                      | No                                                                                  |                                                           | Shown when the `validationState` of the input field is set to Error. Only one of `helpText`, `errorText` or `successText` is shown at a time in the priority order as `errorText`, `successText`, `helpText`                                                                          |
| successText                                                       | `string`                                                      | No                                                                                  |                                                           | Shown when the `validationState` of the input field is set to Success. Only one of `helpText`, `errorText` or `successText` is shown at a time in the priority order as `errorText`, `successText`, `helpText`                                                                        |
| autoFocus                                                         | `boolean`                                                     | No                                                                                  | `false`                                                   | The autofocus global attribute is a Boolean attribute indicating that an element should be focused on page load. [Web Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autofocus), [Native Reference](https://reactnative.dev/docs/textinput#autofocus) |
| fullWidth                                                         | `boolean`                                                     | No                                                                                  | `false`                                                   | **Discuss if we want to add support for full-width input fields.**                                                                                                                                                                                                                    |
| Keyboard type(decide the prop for showing relevant keyboard type) |                                                               |                                                                                     |                                                           | **decide the prop for showing relevant keyboard type**                                                                                                                                                                                                                                |
| autocomplete                                                      | `boolean`                                                     | No                                                                                  |                                                           | **Decide how to control this. this controls how browsers show autofill password**                                                                                                                                                                                                     |
| type                                                              | `text`, `decimal`, `numeric`, `tel`, `email`, `url`, `search` | No                                                                                  | `text`                                                    | Determines the type of input field to be rendered                                                                                                                                                                                                                                     |

Input types we need:

- simple plain text
- search
- telephone
- email
- url
- decimal number

auto-complete

- name
- email
- username
- one-time-code
- tel
- url

Web <> React Native Map
|type|web props|react-native props|
| type |web attributes | react-native attributes |
|---|---|---|
|text|||
|search|`inputmode=search`, `autocomplete=off`(can give option to consumer to configure this with more options which are contextual)|`keyboardType=default`, `returnKeyType=search`|
|tel|`inputmode="tel"`, `autocomplete="tel"`| `keyboardType="phone-pad"`|
|email|`inputmode="email"`, `autocomplete="email"`|`keyboardType="email-address"`|
|url|`inputmode="url"`, `autocomplete="off"`|`keyboardType="url"`|
|numeric|`type="text"`, `inputmode="decimal"`, `autocomplete="off"`| `keyboardType="decimal-pad"`|

- fullWidth(confirm this once)
- keyboard - type, inputmode, autocomplete
  - web
    - https://css-tricks.com/better-form-inputs-for-better-mobile-user-experiences/
    - https://better-mobile-inputs.netlify.app/
    - inputmode
  - native
    - keyboardType attribute - https://reactnative.dev/docs/textinput#keyboardtype
- `autocomplete` for web
  - https://polaris.shopify.com/components/text-field
- textContentType for autocomplete on native ios only
  - https://reactnative.dev/docs/textinput#textcontenttype-ios
- novalidate for web

Password

- label
- label position
- placeholder
- value - (controlled)
- onChange
- isDisabled
- maxCharacters
- validationState
- helpText
- errorText
- successText

Resuable components candidate

- label
- helpText/errorText/successText
- character counter(only input field)
- clear icon button
- prefix/suffix

## Open questions

- Do we have a usecase of using textfield without label or form level things?
- Do we need to expose `autoCapitalize` for native?
- Do we need to fix the height for reserving space for help/error/success text?
- motion for the textfield animation in active state
- fullWidth inputField do we have a use case?
- returnKeyType native - native
  - enterkeyhint - web
- what is the default position for loader in loading state? following are some options

  - based on icon prop
  - based on clearbutton
  - leave this decision upto consumer
  - fix it either on left/right

- Do we have icon which is clickable so we can put it under textfield?
  - We don't have need to create one
- Do we need link? what is the use case?
  - NA
- How to handle the view layout changes on mobile when the keyboard appears so the input doesn't moves out of the view
  - accept and pass ref
- `textAlign` on native need to be exposed?
  - yes might be required for OTP
- multiline error messages?
  - deferred for now until we have a use case for it
- Do we need to show errorText/successText along with helpText or only one of them can be shown at a time?

  - only one at a time in the priority errorText > successText > helpText

- `readonly` need to be supported? or just disabled? or both?

  - Using the disabled prop will prevent the text field from receive keyboard focus or inputs
  - The readOnly prop allows focus on the text field but prevents input or editing
  - We'll right now just go with disabled prop

- labelAlignment - do we need to give this option? if no, then what is the default alignment when the position is left? -

  - always left aligned

- do we need a trailingIconClick? what if we provide clear button and the onClick for that and then only have leading and trailing props which can accept text as well as icon?

  - added `showClearButton` prop along with `onClearButtonClick` handler

Sample API

<TextInput type="">
<PasswordInput>
<OtpInput>
<CardInput>

// TODO:

- Define basetext field with all P&C
- Define plain input
- define password input
- keyboard type maps for web and native
- define a11y -- defer
- open questions from Saurav
