import type { ReactElement, ReactNode } from 'react';
import React from 'react';
import { AccordionButton } from './AccordionButton';
import { AccordionItemContext, useAccordion } from './AccordionContext';
import { AccordionItemBody } from './AccordionItemBody';
import { componentIds } from './componentIds';
import { Divider } from '~components/Divider';
import { BaseBox } from '~components/Box/BaseBox';
import type { IconComponent } from '~components/Icons';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import { isReactNative } from '~utils';
import { Collapsible } from '~components/Collapsible/Collapsible';
import { CollapsibleBody } from '~components/Collapsible';
import type { TestID, DataAnalyticsAttribute } from '~utils/types';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { throwBladeError } from '~utils/logger';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

type AccordionItemProps = {
  /**
   * Title text content
   *
   * @deprecated Use AccordionItemHeader and AccordionItemBody
   *
   * Checkout https://blade.razorpay.com/?path=/docs/components-accordion--docs for new API
   */
  title?: string;

  /**
   * Body text content
   *
   *  @deprecated Use AccordionItemHeader and AccordionItemBody
   *
   * Checkout https://blade.razorpay.com/?path=/docs/components-accordion--docs for new API
   */
  description?: string;

  /**
   * Renders a Blade icon as title prefix (requires `showNumberPrefix={false}`)
   *
   * @deprecated Use `leading={<StarIcon size="large" />}` on AccordionItemHeader instead
   *
   * Checkout https://blade.razorpay.com/?path=/docs/components-accordion--docs for new API
   */
  icon?: IconComponent;

  /**
   * Slot, renders any custom content
   */
  children?: ReactNode | ReactNode[];

  /**
   * Disabled state of the item
   *
   * @default false
   */
  isDisabled?: boolean;

  /**
   * **Internal:** used for determining numbering, you don't need to pass this,
   * instead pass `showNumberPrefix` to root `Accordion`
   */
  _index?: number;
} & TestID &
  DataAnalyticsAttribute;

const AccordionItem = ({
  title,
  description,
  icon,
  children,
  isDisabled,
  _index,
  testID,
  ...rest
}: AccordionItemProps): ReactElement => {
  const {
    expandedIndex,
    onExpandChange,
    defaultExpandedIndex,
    variant,
    numberOfItems,
  } = useAccordion();
  const isExpanded = expandedIndex === _index;
  const isDefaultExpanded = defaultExpandedIndex === _index;
  const isDeprecatedAPI = Boolean(title) || Boolean(description) || Boolean(icon);
  const [header, body] = React.Children.toArray(children);

  if (!isDeprecatedAPI) {
    // Only doing validation in new API. Deprecated API allows everything as AccordionItem children
    const headerComponentId = getComponentId(header);
    const bodyComponentId = getComponentId(body);

    if (
      headerComponentId !== componentIds.AccordionItemHeader &&
      bodyComponentId !== componentIds.AccordionItemBody
    ) {
      throwBladeError({
        message:
          'AccordionItem only allows AccordionItemHeader as first component and AccordionItemBody as second. Check Accordion documentation',
        moduleName: 'AccordionItem',
      });
    }
  }

  const isLastItem = _index !== undefined && _index < numberOfItems - 1;

  const handleExpandChange = ({ isExpanded }: { isExpanded: boolean }): void => {
    if (isExpanded && typeof _index !== 'undefined') {
      onExpandChange(_index);
    } else {
      onExpandChange(-1);
    }
  };

  return (
    <AccordionItemContext.Provider
      value={{
        index: _index,
        isDisabled,
      }}
    >
      <BaseBox
        {...metaAttribute({ name: MetaConstants.AccordionItem, testID })}
        {...makeAnalyticsAttribute(rest)}
      >
        <Collapsible
          isExpanded={isExpanded}
          defaultIsExpanded={isDefaultExpanded}
          onExpandChange={handleExpandChange}
          // Accordion has its own width restrictions
          _shouldApplyWidthRestrictions={false}
          _dangerouslyDisableValidations={true}
        >
          <AccordionButton
            index={_index}
            icon={icon}
            title={title}
            header={header}
            isDisabled={isDisabled}
            isDeprecatedAPI={isDeprecatedAPI}
          />
          <CollapsibleBody
            // Just React Native things, need this 100% so collapsed content flows correctly inside Accordion
            // In new API, AccordionItemBody takes 100% width to avoid issues like this - https://github.com/razorpay/blade/pull/1814
            width={isReactNative() || !isDeprecatedAPI ? '100%' : undefined}
          >
            {isDeprecatedAPI ? (
              <AccordionItemBody _description={description}>{children}</AccordionItemBody>
            ) : (
              body
            )}
          </CollapsibleBody>
        </Collapsible>
        {isLastItem || variant === 'transparent' ? <Divider /> : null}
      </BaseBox>
    </AccordionItemContext.Provider>
  );
};

export type { AccordionItemProps };
export { AccordionItem };
