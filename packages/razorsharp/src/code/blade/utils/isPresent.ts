export const isPresent = (value: string | boolean | undefined): boolean => {
  if (typeof value === 'undefined') {
    return false;
  }
  if (typeof value === 'string') {
    return value === 'True';
  }

  return value;
};
