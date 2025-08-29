import { CounterProps } from './Counter';
import { TypographyPlatforms, Size } from '../../tokens/global';
import { DotNotationSpacingStringToken } from '../../utils/types';
type CounterMaxWidth = Size[100] | Size[120];
declare const counterHeight: Record<NonNullable<CounterProps['size']>, number>;
declare const horizontalPadding: Record<NonNullable<CounterProps['size']>, DotNotationSpacingStringToken>;
declare const maxWidth: Record<NonNullable<TypographyPlatforms>, CounterMaxWidth>;
export { maxWidth, counterHeight, horizontalPadding };
