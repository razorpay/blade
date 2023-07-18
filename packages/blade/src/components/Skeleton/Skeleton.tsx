/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { PulseAnimation } from './PulseAnimation';
import type { SkeletonProps } from './types';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

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
  testID,
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
      testID={testID}
      {...getStyledProps(props)}
      {...metaAttribute({ name: MetaConstants.Skeleton })}
    />
  );
};

export { Skeleton };
