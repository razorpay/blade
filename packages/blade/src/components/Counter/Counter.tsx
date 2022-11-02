import { Badge } from '../Badge';
import type { Feedback } from '~tokens/theme/theme';

export type CounterProps = {
  value: number;
  max?: number;
  intent?: Feedback;
  contrast?: 'high' | 'low';
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
