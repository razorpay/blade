# Input Decisions <!-- omit in toc -->

- [Design](#design)
- [InputField API](#inputfield-api)

## Design

[Figma Link](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=10953%3A191574)

## InputField API

| Prop                                                              | Type                                                                      | Required                                                                            | Default | Description                                                                                                                                                                                                                                   |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| label                                                             | `string`                                                                  | (confirm if we have a use case for input field without labels(search field maybe?)) |         | Determines the label of an input field. Also used as `aria-label`                                                                                                                                                                             |
| labelPosition                                                     | `top`, `left`                                                             | No                                                                                  | `top`   | Used to identify if the label of the input field will be placed on the top of the input field or left                                                                                                                                         |
| placeholder                                                       | `string`                                                                  | No                                                                                  | `''`    | Defines the placeholder text to be displayed inside the input field                                                                                                                                                                           |
| value                                                             | `string`                                                                  | No                                                                                  |         | Makes input field [controlled](https://reactjs.org/docs/forms.html#controlled-components)                                                                                                                                                     |
| onChange                                                          | `({ event, name, value }) => {}`                                          | No                                                                                  |         | Function called when the value of the input field changes                                                                                                                                                                                     |
| isDisabled                                                        | `boolean`                                                                 | No                                                                                  | `false` | **Marks the input field as disabled. It'll also loose keyboard focus. Discuss if we want to rather go ahead with readonly attribute**                                                                                                         |
| leadingIcon                                                       | `Icon`                                                                    | No                                                                                  |         | **Icon to be displayed at the start of the input field. This prop limits to only display Icon, things like some prefix eg: `$` won't be supported. Discuss this**                                                                             |
| trailingIcon                                                      | `Icon`                                                                    | No                                                                                  |         | **Icon to be displayed at the end of the input field. This prop limits to only display Icon, things like some suffix eg: `.00` or `@gmail.com` won't be supported. Discuss this**                                                             |
| onTrailingIconClick                                               | `(event) => {}`                                                           | No                                                                                  |         | Used when we want to provide a clear icon to clear the text. **If this is only used for this purpose and we don't have any other use case for trailingicon click then might as well explore exposing a `showClearButton` prop. Discuss this** |
| isLoading                                                         | `boolean`                                                                 | No                                                                                  | `false` | Used to show a spinner when the the data is being loaded. **Discuss if we want to fix the loader to right of the input field or expose a prop for that and let the users decide on that.**                                                    |
| maxCharacters                                                     | `number`                                                                  | No                                                                                  |         | Used to show a character counter under the input field                                                                                                                                                                                        |
| validationStatus                                                  | `error` , `success`                                                       | No                                                                                  |         | Applies the style to the input field based on validation status and shows either `errorText` or `successText` respectively                                                                                                                    |
| helpText                                                          | `string`                                                                  | No                                                                                  |         | Shown when we want to add some hint to the input field. Displayed under the input field. Only one of `helpText`, `errorText` or `successText` is shown at a time in the priority order as `errorText`, `successText`, `helpText`              |
| errorText                                                         | `string`                                                                  | No                                                                                  |         | Shown when the `validationStatus` of the input field is set to Error. Only one of `helpText`, `errorText` or `successText` is shown at a time in the priority order as `errorText`, `successText`, `helpText`                                 |
| successText                                                       | `string`                                                                  | No                                                                                  |         | Shown when the `validationStatus` of the input field is set to Success. Only one of `helpText`, `errorText` or `successText` is shown at a time in the priority order as `errorText`, `successText`, `helpText`                               |
| fullWidth                                                         | `boolean`                                                                 | No                                                                                  | `false` | **Discuss if we want to add support for full-width input fields.**                                                                                                                                                                            |
| Keyboard type(decide the prop for showing relevant keyboard type) |                                                                           |                                                                                     |         | **decide the prop for showing relevant keyboard type**                                                                                                                                                                                        |
| autocomplete                                                      | `boolean`                                                                 | No                                                                                  |         | **Decide how to control this. this controls how browsers show autofill password**                                                                                                                                                             |
| type                                                              | `text`, `password`, `decimal`, `numeric`, `tel`, `email`, `url`, `search` | No                                                                                  | `text`  | Determines the type of input field to be rendered                                                                                                                                                                                             |

Input

- fullWidth(confirm this once)
- keyboard
  - web
    - https://css-tricks.com/better-form-inputs-for-better-mobile-user-experiences/
    - https://better-mobile-inputs.netlify.app/
    - inputmode
  - native
    - keyboardType attribute - https://reactnative.dev/docs/textinput#keyboardtype
- autocomplete
  - https://polaris.shopify.com/components/text-field
- novalidate for web

Password

- label
- label position
- placeholder
- value - (controlled)
- onChange
- isDisabled
- maxCharacters
- validationStatus
- helpText
- errorText
- successText

Resuable components:

- label
- helpText/errorText/successText
- character counter(only input field)

Open questions:

- do we need link? what is the use case? -- unknown
- type: text | decimal | numeric | tel | email | url | search -- Validations for each of them?
- do we have a usecase of using textfield without label or form level things?
- autoCapitalize(native) - do we need this?
- how to handle the view layout changes on mobile when they keyboard appears so the input doesn't moves out of the view
- textAlign on native? really required?
- do we have icon which is clickable so we can put it under textfield
- multiline error messages?
- Icon click
- Do we need to show errorText/successText along with helpText or only one of them can be shown at a time? only one at a time
- readonly is it required? or just disabled? or both?
  - Using the disabled prop will prevent the text field from receive keyboard focus or inputs
  - The readOnly prop allows focus on the text field but prevents input or editing
- do we need to fix the height for reserving space for help/error/success text
- adding support for things like suffix/prefix text - `$` or `@gmail.com`
  - Similar API - https://reshaped.so/content/docs/components/text-field#slots
- motion for the highlight
- fullWidth inputfield do we have a use case?
- labelAlignment - do we need to give this option? if no, then what is the default alignment when the position is left?
- what is the default position for loader? do we need an option to provide that as well?
- do we need a trailingIconClick? what if we provide clear button and the onClick for that and then only have leading and trailing props which can accept text as well as icon?

- multiline validations - deferred
- loading? -- do we need loading state? -- yes
