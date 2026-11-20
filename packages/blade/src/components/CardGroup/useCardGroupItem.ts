import React from 'react';
import type { CardGroupItemProps } from './types';
import { useIsInsideCardGroupBody } from './CardGroupContext';
import { CollapsibleContext } from '~components/Collapsible/CollapsibleContext';

type UseCardGroupItemReturn = {
  isTrigger: boolean;
  isNavigation: boolean;
  isInteractive: boolean;
  isExpanded: boolean;
  collapsibleBodyId?: string;
  handlePress: (event: unknown) => void;
};

/**
 * Shared row logic for web and native. A row acts as the disclosure trigger
 * when it sits directly inside a Collapsible (via CardGroupCollapsibleItem) but
 * not inside that item's body; otherwise it navigates (`href`) or selects.
 */
export const useCardGroupItem = ({
  href,
  onClick,
  isSelected,
  isDisabled,
}: Pick<
  CardGroupItemProps,
  'href' | 'onClick' | 'isSelected' | 'isDisabled'
>): UseCardGroupItemReturn => {
  const collapsible = React.useContext(CollapsibleContext);
  const insideBody = useIsInsideCardGroupBody();

  const isTrigger = Boolean(collapsible) && !insideBody;
  const isNavigation = Boolean(href) && !isTrigger;
  const isInteractive = isTrigger || isNavigation || Boolean(onClick) || Boolean(isSelected);
  const isExpanded = isTrigger ? Boolean(collapsible?.isExpanded) : false;

  const handlePress = React.useCallback(
    (event: unknown) => {
      if (isDisabled) return;
      if (isTrigger && collapsible) {
        collapsible.onExpandChange(!collapsible.isExpanded);
        return;
      }
      (onClick as ((event: unknown) => void) | undefined)?.(event);
    },
    [isDisabled, isTrigger, collapsible, onClick],
  );

  return {
    isTrigger,
    isNavigation,
    isInteractive,
    isExpanded,
    collapsibleBodyId: collapsible?.collapsibleBodyId,
    handlePress,
  };
};
