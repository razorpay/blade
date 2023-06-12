import type { ReactElement, ReactNode } from 'react';
import { AccordionButton } from './AccordionButton';
import { BaseBox } from '~components/Box/BaseBox';
import type { IconComponent } from '~components/Icons';
import type { TestID } from '~src/_helpers/types';
import { Divider } from '~components/BaseHeaderFooter/Divider';
import { Text } from '~components/Typography';
import { Collapsible, CollapsibleBody } from '~components/Collapsible';

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
}: AccordionItemProps): ReactElement => {
  const _description = description && <Text type="subtle">{description}</Text>;

  return (
    <>
      <Collapsible>
        <AccordionButton index={_index} icon={icon}>
          {title}
        </AccordionButton>
        <CollapsibleBody>
          <BaseBox gap="spacing.5" marginBottom="spacing.5" marginX="spacing.5">
            {_description}
            {children}
          </BaseBox>
        </CollapsibleBody>
      </Collapsible>
      <Divider />
    </>
  );
};

export { AccordionItemProps, AccordionItem };
