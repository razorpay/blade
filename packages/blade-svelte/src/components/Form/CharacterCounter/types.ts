export type CharacterCounterProps = {
  /**
   * Current character count
   */
  currentCount: number;

  /**
   * Maximum character count
   */
  maxCount: number;

  /**
   * Size of the counter
   * @default 'medium'
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
};

