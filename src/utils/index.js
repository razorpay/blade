const flattenArray = (arr) => {
  return Array.prototype.concat.apply([], arr);
};

export { flattenArray };
