const metaAttribute = (name: string, value: string | undefined): Record<string, string> => {
  if (!value) return {};
  return { [`data-${name}`]: value };
};

export { metaAttribute };
