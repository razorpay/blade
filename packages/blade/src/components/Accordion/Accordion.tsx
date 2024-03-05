import type { ReactElement } from 'react';
import { useCallback, useMemo, useState, cloneElement, Children } from 'react';
import type { AccordionContextState } from './AccordionContext';
import { AccordionContext } from './AccordionContext';
import { MAX_WIDTH } from './styles';
import { BaseBox } from '~components/Box/BaseBox';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { getStyledProps } from '~components/Box/styledProps';
import type { BoxProps } from '~components/Box';
import { size } from '~tokens/global';
import type { TestID } from '~utils/types';
import { makeSize } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

type AccordionProps = {
  /**
   * Makes the passed item index expanded by default (uncontrolled)
   */
  defaultExpandedIndex?: number;

  /**
   * Expands the passed index (controlled), `-1` implies no expanded items
   */
  expandedIndex?: number;

  /**
   * Callback for change in any item's expanded state,
   * `-1` implies no expanded items
   */
  onExpandChange?: ({ expandedIndex }: { expandedIndex: number }) => void;

  /**
   * Adds numeric index at the beginning of items
   *
   * @default false
   */
  showNumberPrefix?: boolean;

  /**
   * Visual variant of AccordionItem
   *
   * @default borderless
   */
  variant?: 'bordered' | 'borderless';

  /**
   * Accepts `AccordionItem` child nodes
   */
  children: ReactElement | ReactElement[];
} & TestID &
  StyledPropsBlade;

const MIN_WIDTH: BoxProps['minWidth'] = {
  s: makeSize(size[200]),
  m: makeSize(size[360]),
  l: makeSize(size[360]),
};

const getVariantStyles = (variant: AccordionProps['variant']): BoxProps => {
  if (variant === 'borderless') {
    return {};
  }

  return {
    backgroundColor: 'surface.background.gray.intense',
    borderRadius: 'medium',
    borderWidth: 'thinner',
    borderColor: 'surface.border.gray.subtle',
  };
};

const Accordion = ({
  defaultExpandedIndex,
  expandedIndex,
  onExpandChange,
  showNumberPrefix = false,
  children,
  variant = 'borderless',
  testID,
  ...styledProps
}: AccordionProps): ReactElement => {
  const [expandedAccordionItemIndex, setExpandedAccordionItemIndex] = useState<number | undefined>(
    defaultExpandedIndex,
  );

  const numberOfItems = Children.count(children);

  const handleExpandChange = useCallback(
    (nextExpandedIndex: number) => {
      if (typeof expandedIndex !== 'undefined') {
        // controlled
        onExpandChange?.({ expandedIndex: nextExpandedIndex });
      } else {
        // uncontrolled
        setExpandedAccordionItemIndex(nextExpandedIndex);
        onExpandChange?.({ expandedIndex: nextExpandedIndex });
      }
    },
    [onExpandChange, expandedIndex],
  );

  const accordionContext = useMemo<AccordionContextState>(
    () => ({
      expandedIndex: expandedIndex ?? expandedAccordionItemIndex,
      defaultExpandedIndex,
      onExpandChange: handleExpandChange,
      showNumberPrefix,
      variant,
      numberOfItems,
    }),
    [
      expandedAccordionItemIndex,
      handleExpandChange,
      expandedIndex,
      showNumberPrefix,
      defaultExpandedIndex,
      variant,
      numberOfItems,
    ],
  );

  return (
    <AccordionContext.Provider value={accordionContext}>
      <BaseBox
        {...metaAttribute({ name: MetaConstants.Accordion, testID })}
        {...getStyledProps(styledProps)}
      >
        <BaseBox
          {...getVariantStyles(variant)}
          minWidth={MIN_WIDTH}
          maxWidth={MAX_WIDTH}
          width="100%"
        >
          {Children.map(children, (child, index) =>
            cloneElement(child, { _index: index, key: index }),
          )}
        </BaseBox>
      </BaseBox>
    </AccordionContext.Provider>
  );
};

export type { AccordionProps };
export { Accordion };
