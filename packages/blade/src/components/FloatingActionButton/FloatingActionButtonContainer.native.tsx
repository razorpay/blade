import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { FloatingActionButtonContainerProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { makeSpace } from '~utils/makeSpace';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

const placementToJustifyContent = {
  'bottom-start': 'flex-start',
  'bottom-end': 'flex-end',
  bottom: 'center',
} as const;

/**
 * Anchors the button to the bottom of the screen and owns its drop shadow.
 *
 * React Native has no `position: fixed`, so the button is absolutely positioned
 * and is expected to be mounted inside a filling parent.
 *
 * The positioning is done with a full-width row rather than by setting `left` /
 * `right` directly, because centering would otherwise need a percentage
 * `translateX`, which React Native does not support reliably. The row is
 * `pointerEvents="box-none"` so it does not swallow touches meant for the
 * content behind it, and the drop shadow sits on the inner, button-sized box so
 * it traces the pill rather than the row.
 *
 * The bottom safe-area inset is applied to the row so the `offset` is measured
 * from the top of the home indicator / navigation bar rather than from the
 * physical bottom of the screen.
 */
const FloatingActionButtonContainer = ({
  children,
  placement,
  offset,
  zIndex,
  testID,
  ...rest
}: FloatingActionButtonContainerProps): React.ReactElement => {
  const insets = useSafeAreaInsets();

  return (
    <BaseBox
      position="absolute"
      bottom={makeSpace(insets.bottom)}
      left="0px"
      right="0px"
      paddingLeft={offset}
      paddingRight={offset}
      paddingBottom={offset}
      display="flex"
      flexDirection="row"
      justifyContent={placementToJustifyContent[placement]}
      pointerEvents="box-none"
      zIndex={zIndex}
      {...metaAttribute({ testID, name: MetaConstants.FloatingActionButton })}
      {...makeAnalyticsAttribute(rest)}
      {...getStyledProps(rest)}
    >
      <BaseBox borderRadius="max" elevation="midRaised">
        {children}
      </BaseBox>
    </BaseBox>
  );
};

export { FloatingActionButtonContainer };
