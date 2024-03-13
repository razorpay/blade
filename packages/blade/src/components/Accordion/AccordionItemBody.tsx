import { useAccordion } from './AccordionContext';
import { componentIds } from './componentIds';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { isReactNative } from '~utils';
import { makeAccessible } from '~utils/makeAccessible';
import type { StringChildrenType } from '~utils/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

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

const descriptionSizeToken = {
  large: 'medium',
  medium: 'small',
} as const;

const _AccordionItemBody = ({
  children,
  _description,
}: {
  children?: React.ReactNode | StringChildrenType;
  _description?: string;
}): React.ReactElement => {
  const { size } = useAccordion();

  const childrenElement =
    typeof children === 'string' || typeof children === 'number' ? (
      <Text size={descriptionSizeToken[size]} color="surface.text.gray.subtle">
        {children}
      </Text>
    ) : (
      children
    );

  const descriptionElement = _description && (
    <Text size={descriptionSizeToken[size]} color="surface.text.gray.subtle">
      {_description}
    </Text>
  );

  const collapsibleBodyContent = isReactNative() ? (
    <BaseBox marginX="spacing.5">
      {descriptionElement}
      <BaseBox marginTop={_description && children ? 'spacing.5' : 'spacing.0'}>
        {childrenElement}
      </BaseBox>
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
      {descriptionElement}
      {childrenElement}
    </BaseBox>
  );

  return <BaseBox>{collapsibleBodyContent}</BaseBox>;
};

const AccordionItemBody = assignWithoutSideEffects(_AccordionItemBody, {
  componentId: componentIds.AccordionItemBody,
});

export { AccordionItemBody };
