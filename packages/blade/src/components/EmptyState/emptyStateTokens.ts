import type { DotNotationSpacingStringToken } from '~utils/types';
import type { HeadingProps } from '~components/Typography/Heading/Heading';
import type { BaseTextSizes } from '~components/Typography/BaseText/types';

export type EmptyStateSize = 'small' | 'medium' | 'large' | 'xlarge';

export type EmptyStateSizeTokens = {
  titleSize: Extract<HeadingProps['size'], 'small' | 'medium' | 'xlarge'>;
  descriptionSize: Extract<BaseTextSizes, 'xsmall' | 'small' | 'medium' | 'large'>;
  gapBetweenSections: DotNotationSpacingStringToken;
};

export const emptyStateSizeTokens: Record<EmptyStateSize, EmptyStateSizeTokens> = {
  small: {
    titleSize: 'small',
    descriptionSize: 'xsmall',
    gapBetweenSections: 'spacing.5',
  },
  medium: {
    titleSize: 'small',
    descriptionSize: 'small',
    gapBetweenSections: 'spacing.6',
  },
  large: {
    titleSize: 'medium',
    descriptionSize: 'medium',
    gapBetweenSections: 'spacing.7',
  },
  xlarge: {
    titleSize: 'xlarge',
    descriptionSize: 'large',
    gapBetweenSections: 'spacing.8',
  },
};
