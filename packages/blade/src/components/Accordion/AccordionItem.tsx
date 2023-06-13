import type { ReactElement, ReactNode } from 'react';
import { AccordionButton } from './AccordionButton';
import { useAccordion } from './AccordionContext';
import { BaseBox } from '~components/Box/BaseBox';
import type { IconComponent } from '~components/Icons';
import type { TestID } from '~src/_helpers/types';
import { Divider } from '~components/BaseHeaderFooter/Divider';
import { Text } from '~components/Typography';
import { Collapsible } from '~components/Collapsible/Collapsible';
import { MetaConstants, metaAttribute } from '~utils';
import { CollapsibleBody } from '~components/Collapsible/CollapsibleBody';

type AccordionItemProps = {
  /**
   * Title text content
   */
  title: string;

  /**
   * Body text content
   */
  description?: string;

  /**
   * Renders a Blade icon as title prefix (requires `showNumberPrefix={false}`)
   */
  icon?: IconComponent;

  /**
   * Slot, renders any custom content
   */
  children?: ReactNode;

  /**
   * **Internal:** used for determining numbering, you don't need to pass this,
   * instead pass `showNumberPrefix` to root `Accordion`
   */
  _index?: number;
} & TestID;

const AccordionItem = ({
  title,
  description,
  icon,
  children,
  _index,
  testID,
}: AccordionItemProps): ReactElement => {
  const { expandedIndex, onExpandChange, defaultExpandedIndex } = useAccordion();
  const isExpanded = expandedIndex === _index;
  const isDefaultExpanded = defaultExpandedIndex === _index;

  const _description = description && <Text type="subtle">{description}</Text>;
  const handleExpandChange = ({ isExpanded }: { isExpanded: boolean }): void => {
    if (isExpanded && typeof _index !== 'undefined') {
      onExpandChange(_index);
    } else {
      onExpandChange(-1);
    }
  };

  return (
    <BaseBox {...metaAttribute({ name: MetaConstants.AccordionItem, testID })}>
      <Collapsible
        isExpanded={isExpanded}
        defaultIsExpanded={isDefaultExpanded}
        onExpandChange={handleExpandChange}
        // Accordion has its own width restrictions
        _shouldApplyWidthRestrictions={false}
      >
        <AccordionButton index={_index} icon={icon}>
          {title}
        </AccordionButton>
        <CollapsibleBody>
          <BaseBox
            display="flex"
            flexDirection="column"
            gap="spacing.5"
            marginBottom="spacing.5"
            marginX="spacing.5"
          >
            {_description}
            {children}
          </BaseBox>
        </CollapsibleBody>
      </Collapsible>
      <Divider />
    </BaseBox>
  );
};

export { AccordionItemProps, AccordionItem };
