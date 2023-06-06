import type { ReactElement, ReactNode } from 'react';
import { useState, useMemo } from 'react';

import type { CollapsibleContextState } from './CollapsibleContext';
import { CollapsibleContext } from './CollapsibleContext';
import BaseBox from '~components/Box/BaseBox';
import type { TestID } from '~src/_helpers/types';
import type { StyledPropsBlade } from '~components/Box/styledProps';

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
  direction: 'bottom' | 'top';

  /**
   * Expands the collapsible content by default (uncontrolled)
   *
   * @default false
   */
  defaultIsExpanded: boolean;

  /**
   * Expands the collapsible content (controlled)
   *
   * @default undefined
   */
  isExpanded: boolean;

  /**
   * Callback for change in collapsible's expanded state
   *
   * @default undefined
   */
  onChange: ({ isExpanded }: { isExpanded: boolean }) => void;
} & TestID &
  StyledPropsBlade;

const Collapsible = ({
  children,
  direction = 'bottom',
  defaultIsExpanded = false,
  isExpanded,
  onChange,
  testID,
  ...styledProps
}: CollapsibleProps): ReactElement => {
  const [isBodyExpanded, setIsBodyExpanded] = useState(defaultIsExpanded);

  const contextValue = useMemo<CollapsibleContextState>(
    () => ({
      isExpanded: isBodyExpanded,
      setIsExpanded: setIsBodyExpanded,
      defaultIsExpanded,
    }),
    [isBodyExpanded, defaultIsExpanded],
  );

  return (
    <CollapsibleContext.Provider value={contextValue}>
      <BaseBox
        display="flex"
        flexDirection={direction === 'bottom' ? 'column' : 'column-reverse'}
        gap="spacing.5"
        alignItems="flex-start"
      >
        {children}
      </BaseBox>
    </CollapsibleContext.Provider>
  );
};

// TODO: - handle meta attributes, styled props
// TODO: - handle valid children checks

export { Collapsible, CollapsibleProps };
