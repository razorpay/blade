const transformString = (string = '', transformType = 'none') => {
  switch (transformType) {
    case 'characters':
      return string.toUpperCase();
    default:
      return string;
  }
};

export { transformString };
