const getDownwardEvenNumber = (val) => {
  if (val % 2 === 0) {
    return `${val}px`;
  } else {
    return getDownwardEvenNumber(val - 1);
  }
};

const getLineHeight = (fontSize, lineHeightMultiplier) => {
  const lineHeight = parseInt(parseFloat(fontSize) * parseFloat(lineHeightMultiplier), 10);
  return getDownwardEvenNumber(lineHeight);
};

export { getLineHeight };
