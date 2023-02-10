export const getMediaQuery = (breakpointValue: number): string => {
  return `screen and (min-width: ${breakpointValue}px)`;
};
