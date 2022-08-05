import type { ReactElement } from 'react';
import type { IconComponent } from '../Icons';
import { Text } from '~components/Typography';

type BadgeProps = {
  children: string;
  variant?: 'positive' | 'negative' | 'notice' | 'information' | 'neutral';
  contrast?: 'low' | 'high';
  size?: 'small' | 'medium';
  icon?: IconComponent;
  fontStyle?: 'normal' | 'italic';
  fontWeight?: 'regular' | 'bold';
};

const Badge = ({
  children,
  contrast,
  fontStyle,
  fontWeight,
  icon,
  size,
  variant,
}: BadgeProps): ReactElement => {
  console.log('unused props', contrast, fontStyle, fontWeight, icon, size, variant);
  return <Text>{children}</Text>;
};

export { Badge, BadgeProps };
