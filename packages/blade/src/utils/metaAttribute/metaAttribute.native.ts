const metaAttribute = ({ testID }: { name?: string; testID?: string }): Record<string, string> => {
  return {
    ...(testID ? { testID } : {}),
  };
};

export { metaAttribute };
