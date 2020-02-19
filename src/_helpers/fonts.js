const getLineHeight = (theme, size, lineHeight) => {
  return parseFloat(theme.fonts.lineHeight[lineHeight]) * parseFloat(theme.fonts.size[size]);
};

export { getLineHeight };
