/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { PulseAnimation } from './PulseAnimation';
import type { SkeletonProps } from './types';
import { getStyledProps } from '~components/Box/styledProps';
import { makeAccessible } from '~utils/makeAccessible';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

const Skeleton = ({
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
  placeItems,
  order,
  testID,
  ...props
}: SkeletonProps): React.ReactElement => {
  return (
    <PulseAnimation
      width={width}
      minWidth={minWidth}
      maxWidth={maxWidth}
      height={height}
      minHeight={minHeight}
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
      placeItems={placeItems}
      order={order}
      {...getStyledProps(props)}
      {...makeAccessible({ hidden: true })}
      {...metaAttribute({ name: MetaConstants.Skeleton, testID })}
    />
  );
};

export { Skeleton };
