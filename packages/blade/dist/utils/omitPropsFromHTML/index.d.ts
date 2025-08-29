type shouldForwardProp = <O extends object>(prop: keyof O, defaultValidatorFn: (prop: keyof O) => boolean) => boolean;
declare const omitPropsFromHTML: shouldForwardProp;
export { omitPropsFromHTML };
