import { BadgeProps } from './Badge';
import { DotNotationSpacingStringToken } from '../../utils/types';
import { IconProps } from '../Icons';
declare const badgeHeight: Record<NonNullable<BadgeProps['size']>, number>;
declare const horizontalPadding: Record<NonNullable<BadgeProps['size']>, DotNotationSpacingStringToken>;
declare const iconPadding: Record<NonNullable<BadgeProps['size']>, DotNotationSpacingStringToken>;
declare const iconSize: Record<NonNullable<BadgeProps['size']>, IconProps['size']>;
export { badgeHeight, horizontalPadding, iconPadding, iconSize };
