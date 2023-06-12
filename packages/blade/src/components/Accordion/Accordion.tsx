import type { ReactElement } from 'react';
import { useMemo, useState, cloneElement, Children } from 'react';
import type { AccordionContextState } from './AccordionContext';
import { AccordionContext } from './AccordionContext';
import { BaseBox } from '~components/Box/BaseBox';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { TestID } from '~src/_helpers/types';

type AccordionProps = {
  /**
   * Makes the passed item index expanded by default (uncontrolled)
   */
  defaultExpandedIndex?: number;

  /**
   * Expands the passed index (controlled)
   */
  expandedIndex?: number;

  /**
   * Callback for change in any item's expanded state
   */
  onExpandChange?: ({ expandedIndex }: { expandedIndex: number | undefined }) => void;

  /**
   * Adds numeric index at the beginning of items
   *
   * @default false
   */
  showNumberPrefix?: boolean;

  /**
   * Accepts `AccordionItem` child nodes
   */
  children: ReactElement | ReactElement[];
} & TestID &
  StyledPropsBlade;

const Accordion = ({
  // TODO: implement
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultExpandedIndex,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  expandedIndex,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onExpandChange,
  showNumberPrefix = false,
  children,
}: AccordionProps): ReactElement => {
  const [expandedAccordionItemIndex, setExpandedAccordionItemIndex] = useState<number | undefined>(
    defaultExpandedIndex,
  );
  const accordionContext = useMemo<AccordionContextState>(
    () => ({
      expandedIndex: expandedAccordionItemIndex,
      setExpandedIndex: setExpandedAccordionItemIndex,
    }),
    [expandedAccordionItemIndex],
  );

  return (
    <AccordionContext.Provider value={accordionContext}>
      {showNumberPrefix ? (
        <BaseBox>
          {Children.map(children, (child, index) =>
            cloneElement(child, { _index: index, key: index }),
          )}
        </BaseBox>
      ) : (
        <BaseBox>{children}</BaseBox>
      )}
    </AccordionContext.Provider>
  );
};

export { AccordionProps, Accordion };
