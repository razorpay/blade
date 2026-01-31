export type BackgroundBlur = Readonly<{
  /** low: 4px - Subtle background blur effect */
  low: 4;
  /** medium: 8px - Moderate background blur effect */
  medium: 8;
  /** high: 12px - Strong background blur effect */
  high: 12;
}>;

export const backgroundBlur: BackgroundBlur = {
  low: 4,
  medium: 8,
  high: 12,
};
