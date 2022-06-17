API decisions:

- label
- label position: 'top'|'left'
- placeholder
- value - to make it controlled by consumer
- onChange
- isDisabled
- validationStatus: undefined/none | positive | negative
- trailingIcon
- onTrailingIconClick
- leadingIcon
- maxCharacters: show the char counter and set the character limit
- helpText
- errorText
- successText
- keyboard
  - web
    - https://css-tricks.com/better-form-inputs-for-better-mobile-user-experiences/
    - https://better-mobile-inputs.netlify.app/
    - inputmode
  - native
    - keyboardType attribute - https://reactnative.dev/docs/textinput#keyboardtype
- autocomplete
- novalidate for web

Open questions:

- loading? -- do we need loading state?
- do we need link? what is the use case? -- unknown
- type: text | decimal | numeric | tel | email | url | search -- Validations for each of them?
- do we have a usecase of using textfield without label or form level things?
- multiline validations
- autoCapitalize(native) - do we need this?
- how to handle the view layout changes on mobile when they keyboard appears so the input doesn't moves out of the view
- textAlign on native? really required?
- do we have icon which is clickable so we can put it under textfield
- multiline error messages?
- Icon click
- - Do we need to show errorText/successText along with helpText or only one of them can be shown at a time?
- readonly is it required?
- do we need to fix the height for reserving space for help/error/success text
- motion for the highlight
