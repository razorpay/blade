import React from 'react';
import type { FloatingActionButtonContainerProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

/**
 * Anchors the button to the viewport and owns its drop shadow.
 *
 * The shadow lives here rather than on `BaseButton` because `BaseButton`
 * composes its inner shadows into a single `box-shadow` that is rewritten on
 * `:hover`, `:active` and `:focus-visible` — appending an outer shadow there
 * would mean re-appending it in every one of those states.
 */
const FloatingActionButtonContainer = ({
  children,
  placement,
  offset,
  zIndex,
  testID,
  ...rest
}: FloatingActionButtonContainerProps): React.ReactElement => {
  const isCentered = placement === 'bottom';

  return (
    <BaseBox
      position="fixed"
      bottom={offset}
      left={isCentered ? '50%' : placement === 'bottom-start' ? offset : undefined}
      right={placement === 'bottom-end' ? offset : undefined}
      transform={isCentered ? 'translateX(-50%)' : undefined}
      display="flex"
      borderRadius="max"
      elevation="midRaised"
      zIndex={zIndex}
      {...metaAttribute({ testID, name: MetaConstants.FloatingActionButton })}
      {...makeAnalyticsAttribute(rest)}
      {...getStyledProps(rest)}
    >
      {children}
    </BaseBox>
  );
};

export { FloatingActionButtonContainer };
