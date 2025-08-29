declare const metaAttribute: ({ name, testID, }: {
    name?: string | undefined;
    testID?: string | undefined;
}) => {
    'data-blade-component'?: string;
    'data-testid'?: string;
};
export { metaAttribute };
