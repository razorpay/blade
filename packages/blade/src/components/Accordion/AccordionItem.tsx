import type { ReactElement, ReactNode } from 'react';
import { AccordionButton } from './AccordionButton';
import { useAccordion } from './AccordionContext';
import { Divider } from '~components/Divider';
import { BaseBox } from '~components/Box/BaseBox';
import type { IconComponent } from '~components/Icons';
import { Text } from '~components/Typography';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import { isReactNative } from '~utils';
import { Collapsible } from '~components/Collapsible/Collapsible';
import { CollapsibleBody } from '~components/Collapsible';
import type { TestID } from '~utils/types';
import { makeAccessible } from '~utils/makeAccessible';

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

const BLANK_SPACE = ' ';

/**
 * On React Native if the `AccordionItem` has a lengthy description which renders a `Text` spanning multiple lines,
 * it sometimes messes up the layout calculation (it thinks of multiline as a single line before flowing in the UI).
 * And during the expanding / collapsing animation, text reflows causing words to jump around across lines.
 *
 * Rendering a blank `Text` at the end seems to fix all this 🤯
 */
const reactNativeMultilineTextOverflowFix = (
  // make this hidden from screen readers
  <BaseBox {...makeAccessible({ hidden: true })}>
    <Text>{BLANK_SPACE}</Text>
  </BaseBox>
);

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

  const collapsibleBodyContent = isReactNative() ? (
    <BaseBox marginX="spacing.5">
      {_description}
      <BaseBox marginTop={description && children ? 'spacing.5' : 'spacing.0'}>{children}</BaseBox>
      {reactNativeMultilineTextOverflowFix}
    </BaseBox>
  ) : (
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
  );

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
        <CollapsibleBody
          // Just React Native things, need this 100% so collapsed content flows correctly inside Accordion
          _width={isReactNative() ? '100%' : undefined}
        >
          {collapsibleBodyContent}
        </CollapsibleBody>
      </Collapsible>
      <Divider />
    </BaseBox>
  );
};

export type { AccordionItemProps };
export { AccordionItem };
