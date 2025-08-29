import { DotNotationSpacingStringToken } from '../../utils/types';
import { HeadingProps } from '../Typography/Heading/Heading';
import { BaseTextSizes } from '../Typography/BaseText/types';
export type EmptyStateSize = 'small' | 'medium' | 'large' | 'xlarge';
export type EmptyStateSizeTokens = {
    assetMaxWidth: DotNotationSpacingStringToken | `${string}px`;
    assetMaxHeight: DotNotationSpacingStringToken | `${string}px`;
    titleSize: Extract<HeadingProps['size'], 'small' | 'medium' | 'xlarge'>;
    descriptionSize: Extract<BaseTextSizes, 'xsmall' | 'small' | 'medium' | 'large'>;
    gapBetweenSections: DotNotationSpacingStringToken;
};
export declare const emptyStateSizeTokens: Record<EmptyStateSize, EmptyStateSizeTokens>;
