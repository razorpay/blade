import { Badge } from '../Badge';
import type { Feedback } from '~tokens/theme/theme';

export type CounterProps = {
  /**
   * Sets the value for the counter.
   */
  value: number;
  /**
   * Sets the max value for the counter.
   * If value exceedes `max` it will render `value+`
   */
  max?: number;
  /**
   * Sets the intent of the counter.
   *
   * @default 'neutral'
   */
  intent?: Feedback;
  /**
   * Sets the contrast of the counter.
   *
   * @default 'low'
   */
  contrast?: 'high' | 'low';
  /**
   * Sets the size of the counter.
   *
   * @default 'medium'
   */
  size?: 'small' | 'medium';
};

const Counter = ({
  value,
  max,
  intent = 'neutral',
  contrast = 'low',
  size = 'medium',
}: CounterProps): React.ReactElement => {
  let content = `${value}`;
  if (max && value > max) {
    content = `${max}+`;
  }

  return (
    <Badge size={size} variant={intent} contrast={contrast}>
      {content}
    </Badge>
  );
};

export { Counter };
