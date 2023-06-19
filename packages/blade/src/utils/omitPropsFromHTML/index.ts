// The reason we need to omit them is because styled-component thinks they are valid html attributes
// because fontFamily, fontWeight etc are valid SVG props.
// Here are list of valid props which emotion checks https://github.com/emotion-js/emotion/blob/main/packages/is-prop-valid/src/props.js
// Thus we just need to ignore few of these
const filterProps = [
  'cursor',
  'display',
  'order',
  'color',
  'fontFamily',
  'fontWeight',
  'fontSize',
  'fontStyle',
  'lineHeight',
];

type shouldForwardProp = <O extends object>(
  prop: keyof O,
  defaultValidatorFn: (prop: keyof O) => boolean,
) => boolean;

const omitPropsFromHTML: shouldForwardProp = (prop, defaultValidatorFn): boolean => {
  return !filterProps.includes(prop as string) && defaultValidatorFn(prop);
};

export { omitPropsFromHTML };
