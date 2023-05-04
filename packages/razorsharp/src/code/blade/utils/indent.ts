type Options = {
  indent?: string;
  includeEmptyLines?: boolean;
  count?: number;
};

export const indent = (value: string, options?: Options): string => {
  const { indent = ' ', includeEmptyLines = false, count = 2 } = options ?? {};
  const regex = includeEmptyLines ? /^/gm : /^(?!\s*$)/gm;

  return value.replace(regex, indent.repeat(count));
};
