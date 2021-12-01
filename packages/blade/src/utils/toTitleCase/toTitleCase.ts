const toTitleCase = (inputString: string): string =>
  inputString
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export default toTitleCase;
