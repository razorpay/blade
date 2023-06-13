import type { ReactElement, ReactNode } from 'react';
import { useCallback, useRef, useState, useMemo } from 'react';

import type { CollapsibleContextState } from './CollapsibleContext';
import { CollapsibleContext } from './CollapsibleContext';
import BaseBox from '~components/Box/BaseBox';
import type { TestID } from '~src/_helpers/types';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { BoxProps } from '~components/Box';
import { makeSize } from '~utils';
import { size } from '~tokens/global';

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
  s: `min(${makeSize(size[328])}, calc(100vw - ${makeSize(size[40])}))`,
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ...styledProps
}: CollapsibleProps): ReactElement => {
  const [isBodyExpanded, setIsBodyExpanded] = useState(isExpanded ?? defaultIsExpanded);

  /**
   * Maintain a ref to the initial value of `defaultExpanded || isExpanded` so changing it has no effect.
   * This will help in determining the correct initial height of collapsing panel
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
    }),
    [isBodyExpanded, direction, handleExpandChange, isExpanded],
  );

  return (
    <CollapsibleContext.Provider value={contextValue}>
      <BaseBox
        display="flex"
        flexDirection={direction === 'bottom' ? 'column' : 'column-reverse'}
        alignItems="flex-start"
        minWidth={_shouldApplyWidthRestrictions ? MIN_WIDTH : makeSize(size[0])}
        maxWidth={_shouldApplyWidthRestrictions ? MAX_WIDTH : 'none'}
      >
        {children}
      </BaseBox>
    </CollapsibleContext.Provider>
  );
};

// TODO: - handle meta attributes, styled props
// TODO: - handle valid children checks

export { Collapsible, CollapsibleProps };
