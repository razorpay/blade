/**
 * Icon size map - matches React implementation
 * Maps size tokens to pixel values
 *
 * Source: packages/blade/src/components/Icons/useIconProps/iconSizeMap.ts
 */
export const iconSizeMap = {
  xsmall: 8,
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
  '2xlarge': 32,
} as const;

export type IconSizeMapKey = keyof typeof iconSizeMap;
