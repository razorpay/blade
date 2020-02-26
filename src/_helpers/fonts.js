const getLineHeightFromTextSize = (textSize, theme) => {
  switch (textSize) {
    case 'xxsmall':
      return theme.fonts.lineHeight.xsmall;
    case 'xsmall':
      return theme.fonts.lineHeight.small;
    case 'small':
      return theme.fonts.lineHeight.small;
    case 'medium':
      return theme.fonts.lineHeight.medium;
    case 'large':
    default:
      return theme.fonts.lineHeight.large;
  }
};

export { getLineHeightFromTextSize };
