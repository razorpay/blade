import type { ReactElement } from 'react';
import { cloneElement, Children } from 'react';
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
  onChange?: ({ expandedIndex }: { expandedIndex: number | undefined }) => void;

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
  defaultExpandedIndex,
  expandedIndex,
  onChange,
  showNumberPrefix = false,
  children,
}: AccordionProps): ReactElement => {
  return showNumberPrefix ? (
    <BaseBox>
      {Children.map(children, (child, index) => cloneElement(child, { _index: index, key: index }))}
    </BaseBox>
  ) : (
    <BaseBox>{children}</BaseBox>
  );
};

export { AccordionProps, Accordion };
