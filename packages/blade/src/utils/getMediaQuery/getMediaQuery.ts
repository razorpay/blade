export const getMediaQuery = ({ min, max }: { min: number; max?: number }): string => {
  return `screen and (min-width: ${min}px)${max ? ` and (max-width: ${max}px)` : ''}`;
};
