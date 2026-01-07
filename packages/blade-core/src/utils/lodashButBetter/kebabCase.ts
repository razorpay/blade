const kebabCase = (str: string): string => {
  return str.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    (match, index) => (index ? '-' : '') + match.toLowerCase(),
  );
};

export { kebabCase };
