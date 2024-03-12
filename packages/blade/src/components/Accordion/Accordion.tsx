import type { ReactElement } from 'react';
import { useCallback, useMemo, useState, cloneElement, Children } from 'react';
import type { AccordionContextState } from './AccordionContext';
import { AccordionContext } from './AccordionContext';
import { MAX_WIDTH } from './styles';
import type { AccordionProps } from './types';
import { BaseBox } from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import type { BoxProps } from '~components/Box';
import { size as sizeTokens } from '~tokens/global';
import { makeSize } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

const MIN_WIDTH: BoxProps['minWidth'] = {
  s: makeSize(sizeTokens[200]),
  m: makeSize(sizeTokens[360]),
  l: makeSize(sizeTokens[360]),
};

const getVariantStyles = (variant: AccordionProps['variant']): BoxProps => {
  if (variant === 'transparent') {
    return {};
  }

  return {
    backgroundColor: 'surface.background.gray.intense',
    borderRadius: 'medium',
    borderWidth: 'thinner',
    borderColor: 'surface.border.gray.subtle',
  };
};

/**
 * # Accordion
 *
 * An accordion is used to allow users to toggle between different content sections in a compact vertical stack.
 *
 * ## Usage
 *
 * ```jsx
 * <Accordion>
 *  <AccordionItem>
 *    <AccordionItemHeader title="Title" />
 *    <AccordionItemBody>
 *      <Text color="surface.text.gray.subtle">
 *        Hello this is accordion body content
 *        </Text>
 *     </AccordionItemBody>
 *  </AccordionItem>
 *  <AccordionItem>
 *    <AccordionItemHeader title="Title" />
 *    <AccordionItemBody>
 *      <Text color="surface.text.gray.subtle">
 *         Hello this is accordion body content
 *      </Text>
 *    </AccordionItemBody>
 *  </AccordionItem>
 * </Accordion>
 * ```
 *
 * Checkout https://blade.razorpay.com/?path=/docs/components-accordion--docs
 *
 */
const Accordion = ({
  defaultExpandedIndex,
  expandedIndex,
  onExpandChange,
  showNumberPrefix = false,
  children,
  variant = 'transparent',
  size = 'large',
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
      size,
    }),
    [
      expandedAccordionItemIndex,
      handleExpandChange,
      expandedIndex,
      showNumberPrefix,
      defaultExpandedIndex,
      variant,
      numberOfItems,
      size,
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

export { Accordion };
