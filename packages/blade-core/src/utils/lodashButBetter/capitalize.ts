const capitalize = <T extends string>(str: T): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export { capitalize };
