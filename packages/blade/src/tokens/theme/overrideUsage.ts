// import isObject from 'lodash/isObject'
/* eslint-disable */
// import overrideTheme from './overrideTheme
// import paymentsTheme from './paymentsTheme'

// overrideTheme({ baseTheme: paymentsTheme, overrides: { colors: { brand: { gray: { 300: { onDark: 'asd

// const partialMatchObjectKeys = (objectToMatch, objectToInspect) => {
//   for (const [key, value] of Object.entries(objectToMatch)) {
//     if (objectToInspect.hasOwnProperty(key)) {
//       if (typeof value === 'string') {
//         // this is a valid case, so we shall continue
//         console.log('valid string value', value)
//       } else if (!Array.isArray(value) && isObject(value)) {
//         // let's go inside further and do a nested check
//         partialMatchObjectKeys(value, objectToInspect[key])
//       } else {
//         // the value is of unknown type and we shall throw error
//         console.error(`invalid value of type ${typeof value} at ${key}`)
//       }
//     } else {
//       // the key doesn't exist in the objectToInspect
//       // DX: give the exact structure where this happened, maybe we need an object to store this
//       console.error(`${key} doesn't exist in ${JSON.stringify(objectToInspect)}`)
//     }
//   }
// }
