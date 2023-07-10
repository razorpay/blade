/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { PulseAnimation } from './PulseAnimation';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import type { FlexboxProps } from '~components/Box/BaseBox/types/propsTypes';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { getStyledProps } from '~components/Box/styledProps';

type SkeletonProps = StyledPropsBlade &
  Pick<
    BaseBoxProps,
    'width' | 'maxWidth' | 'minWidth' | 'height' | 'maxHeight' | 'minHeight' | 'borderRadius'
  > &
  Partial<FlexboxProps> & {
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
  ...props
}: SkeletonProps): React.ReactElement => {
  return (
    <PulseAnimation
      width={width}
      maxWidth={maxWidth}
      height={height}
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
      {...getStyledProps(props)}
    />
  );
};

export { Skeleton, SkeletonProps };
