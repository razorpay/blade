/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { PulseAnimation } from './PulseAnimation';
import { lineHeights } from './skeletonTokens';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import type { FlexboxProps } from '~components/Box/BaseBox/types/propsTypes';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { getStyledProps } from '~components/Box/styledProps';
import { makeTypographySize } from '~utils';
import { useTheme } from '~components/BladeProvider';
import { makeAccessible } from '~utils/makeAccessible';

type TextTypes =
  | 'body-small'
  | 'body-medium'
  | 'body-large'
  | 'heading-small'
  | 'heading-medium'
  | 'heading-large'
  | 'title-small'
  | 'title-medium'
  | 'title-large'
  | 'title-xlarge';

type SkeletonProps = StyledPropsBlade &
  Pick<
    BaseBoxProps,
    'width' | 'maxWidth' | 'minWidth' | 'height' | 'maxHeight' | 'minHeight' | 'borderRadius'
  > &
  Partial<FlexboxProps> & {
    type?: TextTypes;
    contrast?: 'low' | 'high';
  };

const Skeleton = ({
  contrast = 'low',
  width,
  maxWidth,
  minWidth,
  height,
  maxHeight,
  minHeight,
  borderRadius,
  flexWrap,
  flexDirection,
  flexGrow,
  flexShrink,
  flexBasis,
  alignItems,
  alignContent,
  alignSelf,
  justifyItems,
  justifyContent,
  justifySelf,
  placeSelf,
  order,
  type,
  ...props
}: SkeletonProps): React.ReactElement => {
  const { theme } = useTheme();
  let computedHeight = height;
  const lineHeight = lineHeights[type!];
  if (lineHeight) {
    computedHeight = height || makeTypographySize(theme.typography.lineHeights[lineHeight]);
  }

  return (
    <PulseAnimation
      width={width}
      maxWidth={maxWidth}
      height={computedHeight}
      maxHeight={maxHeight}
      borderRadius={borderRadius}
      flexWrap={flexWrap}
      flexDirection={flexDirection}
      flexGrow={flexGrow}
      flexShrink={flexShrink}
      flexBasis={flexBasis}
      alignItems={alignItems}
      alignContent={alignContent}
      alignSelf={alignSelf}
      justifyItems={justifyItems}
      justifyContent={justifyContent}
      justifySelf={justifySelf}
      placeSelf={placeSelf}
      order={order}
      contrast={contrast}
      {...makeAccessible({ hidden: true })}
      {...getStyledProps(props)}
    />
  );
};

export { Skeleton, SkeletonProps };
