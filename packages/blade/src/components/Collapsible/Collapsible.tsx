import type { ReactElement, ReactNode } from 'react';
import { Children, useCallback, useRef, useState, useMemo, forwardRef } from 'react';

import type { CollapsibleContextState } from './CollapsibleContext';
import { CollapsibleContext } from './CollapsibleContext';
import { MAX_WIDTH, MAX_WIDTH_NO_RESTRICTIONS } from './styles';
import BaseBox from '~components/Box/BaseBox';
import type { DataAnalyticsAttribute, BladeElementRef, TestID } from '~utils/types';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { getStyledProps } from '~components/Box/styledProps';
import type { BoxProps } from '~components/Box';
import { makeSize } from '~utils';
import { size } from '~tokens/global';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { useId } from '~utils/useId';
import { isValidAllowedChildren } from '~utils/isValidAllowedChildren';
import { throwBladeError } from '~utils/logger';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

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
   * **Internal**: disables trigger validations. Used for AccordionButton and SideNavLink internally
   */
  _dangerouslyDisableValidations?: boolean;
  /**
   * **Internal**: used to override responsive width restrictions
   */
  _shouldApplyWidthRestrictions?: boolean;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

const MIN_WIDTH: BoxProps['minWidth'] = makeSize(size[200]);

const _Collapsible = (
  {
    children,
    direction = 'bottom',
    defaultIsExpanded = false,
    isExpanded,
    onExpandChange,
    testID,
    _shouldApplyWidthRestrictions = true,
    _dangerouslyDisableValidations = false,
    ...rest
  }: CollapsibleProps,
  ref: React.Ref<BladeElementRef>,
): ReactElement => {
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

  if (__DEV__) {
    Children.forEach(children, (child) => {
      if (
        !(
          isValidAllowedChildren(child, MetaConstants.CollapsibleBody) ||
          isValidAllowedChildren(child, MetaConstants.CollapsibleButton) ||
          isValidAllowedChildren(child, MetaConstants.CollapsibleLink)
        ) &&
        !_dangerouslyDisableValidations
      ) {
        throwBladeError({
          message: `only the following are supported as valid children: CollapsibleBody, CollapsibleButton, CollapsibleLink`,
          moduleName: 'Collapsible',
        });
      }
    });
  }

  return (
    <CollapsibleContext.Provider value={contextValue}>
      <BaseBox
        ref={ref as never}
        {...metaAttribute({ name: MetaConstants.Collapsible, testID })}
        {...getStyledProps(rest)}
        {...makeAnalyticsAttribute(rest)}
      >
        <BaseBox
          display="flex"
          flexDirection={direction === 'bottom' ? 'column' : 'column-reverse'}
          alignItems="flex-start"
          minWidth={_shouldApplyWidthRestrictions ? MIN_WIDTH : makeSize(size[0])}
          maxWidth={_shouldApplyWidthRestrictions ? MAX_WIDTH : MAX_WIDTH_NO_RESTRICTIONS}
        >
          {children}
        </BaseBox>
      </BaseBox>
    </CollapsibleContext.Provider>
  );
};

const Collapsible = forwardRef(_Collapsible);

export type { CollapsibleProps };
export { Collapsible };
