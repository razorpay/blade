import type { ReactElement, ReactNode } from 'react';
import { Children, useCallback, useRef, useState, useMemo } from 'react';

import type { CollapsibleContextState } from './CollapsibleContext';
import { CollapsibleContext } from './CollapsibleContext';
import BaseBox from '~components/Box/BaseBox';
import type { TestID } from '~src/_helpers/types';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { getStyledProps } from '~components/Box/styledProps';
import type { BoxProps } from '~components/Box';
import { MetaConstants, isValidAllowedChildren, makeSize, metaAttribute } from '~utils';
import { size } from '~tokens/global';
import { useId } from '~src/hooks/useId';

type CollapsibleProps = {
  /**
   * Composes `CollapsibleButton`, `CollapsibleLink`, `CollapsibleBody`
   */
  children: ReactNode;

  /**
   * Direction in which the content expands
   *
   * @default bottom
   */
  direction?: 'bottom' | 'top';

  /**
   * Expands the collapsible content by default (uncontrolled)
   *
   * @default false
   */
  defaultIsExpanded?: boolean;

  /**
   * Expands the collapsible content (controlled)
   *
   * @default undefined
   */
  isExpanded?: boolean;

  /**
   * Callback for change in collapsible's expanded state
   *
   * @default undefined
   */
  onExpandChange?: ({ isExpanded }: { isExpanded: boolean }) => void;

  /**
   * **Internal**: used to override responsive width restrictions
   */
  _shouldApplyWidthRestrictions?: boolean;
} & TestID &
  StyledPropsBlade;

const MIN_WIDTH: BoxProps['minWidth'] = makeSize(size[200]);

const MAX_WIDTH: BoxProps['maxWidth'] = {
  s: `calc(100vw - ${makeSize(size[40])})`,
  m: makeSize(size[640]),
  l: makeSize(size[1136]),
};

const Collapsible = ({
  children,
  direction = 'bottom',
  defaultIsExpanded = false,
  isExpanded,
  onExpandChange,
  testID,
  _shouldApplyWidthRestrictions = true,
  ...styledProps
}: CollapsibleProps): ReactElement => {
  const [isBodyExpanded, setIsBodyExpanded] = useState(isExpanded ?? defaultIsExpanded);
  const collapsibleBodyId = useId(MetaConstants.CollapsibleBody);

  /**
   * Maintain a ref to the initial value of `defaultExpanded || isExpanded` so changing it has no effect.
   * This will help in determining the correct initial height of collapsing body content
   */
  const initialDefaultExpanded = useRef(Boolean(defaultIsExpanded || isExpanded));

  const handleExpandChange = useCallback(
    (nextIsExpanded: boolean) => {
      if (typeof isExpanded !== 'undefined') {
        // controlled
        onExpandChange?.({ isExpanded: nextIsExpanded });
      } else {
        // uncontrolled
        setIsBodyExpanded(nextIsExpanded);
        onExpandChange?.({ isExpanded: nextIsExpanded });
      }
    },
    [onExpandChange, isExpanded],
  );

  const contextValue = useMemo<CollapsibleContextState>(
    () => ({
      // controlled behavior if isExpanded is provided
      isExpanded: isExpanded ?? isBodyExpanded,
      onExpandChange: handleExpandChange,
      defaultIsExpanded: initialDefaultExpanded.current,
      direction,
      collapsibleBodyId,
    }),
    [isBodyExpanded, direction, handleExpandChange, isExpanded, collapsibleBodyId],
  );

  Children.forEach(children, (child) => {
    if (
      !(
        isValidAllowedChildren(child, MetaConstants.CollapsibleBody) ||
        isValidAllowedChildren(child, MetaConstants.CollapsibleButton) ||
        isValidAllowedChildren(child, MetaConstants.CollapsibleLink) ||
        isValidAllowedChildren(child, MetaConstants.AccordionButton)
      )
    ) {
      throw new Error(
        `[Blade: Collapsible]: only the following are supported as valid children: CollapsibleBody, CollapsibleButton, CollapsibleLink`,
      );
    }
  });

  return (
    <CollapsibleContext.Provider value={contextValue}>
      <BaseBox
        display="flex"
        flexDirection={direction === 'bottom' ? 'column' : 'column-reverse'}
        alignItems="flex-start"
        minWidth={_shouldApplyWidthRestrictions ? MIN_WIDTH : makeSize(size[0])}
        maxWidth={_shouldApplyWidthRestrictions ? MAX_WIDTH : 'none'}
        {...metaAttribute({ name: MetaConstants.Collapsible, testID })}
        {...getStyledProps(styledProps)}
      >
        {children}
      </BaseBox>
    </CollapsibleContext.Provider>
  );
};

export { Collapsible, CollapsibleProps };
