import type { DotNotationSpacingStringToken } from '~utils/types';
import type { HeadingProps } from '~components/Typography/Heading/Heading';
import type { BaseTextSizes } from '~components/Typography/BaseText/types';

export type EmptyStateSize = 'small' | 'medium' | 'large' | 'xlarge';

export type EmptyStateSizeTokens = {
  assetMaxWidth: DotNotationSpacingStringToken | `${string}px`;
  assetMaxHeight: DotNotationSpacingStringToken | `${string}px`;
  titleSize: Extract<HeadingProps['size'], 'small' | 'medium' | 'xlarge'>;
  descriptionSize: Extract<BaseTextSizes, 'xsmall' | 'small' | 'medium' | 'large'>;
  gapBetweenSections: DotNotationSpacingStringToken;
};

export const emptyStateSizeTokens: Record<EmptyStateSize, EmptyStateSizeTokens> = {
  small: {
    assetMaxWidth: '60px',
    assetMaxHeight: '60px',
    titleSize: 'small',
    descriptionSize: 'xsmall',
    gapBetweenSections: 'spacing.5',
  },
  medium: {
    assetMaxWidth: '90px',
    assetMaxHeight: '90px',
    titleSize: 'small',
    descriptionSize: 'small',
    gapBetweenSections: 'spacing.6',
  },
  large: {
    assetMaxWidth: '120px',
    assetMaxHeight: '120px',
    titleSize: 'medium',
    descriptionSize: 'medium',
    gapBetweenSections: 'spacing.7',
  },
  xlarge: {
    assetMaxWidth: '160px',
    assetMaxHeight: '160px',
    titleSize: 'xlarge',
    descriptionSize: 'large',
    gapBetweenSections: 'spacing.8',
  },
};
