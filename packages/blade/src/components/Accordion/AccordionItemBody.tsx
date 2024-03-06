import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { isReactNative } from '~utils';
import { makeAccessible } from '~utils/makeAccessible';

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

const AccordionItemBody = ({
  children,
  description,
}: {
  children?: React.ReactNode;
  description?: string;
}): React.ReactElement => {
  const _description = description && (
    <Text color="interactive.text.gray.subtle">{description}</Text>
  );

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

  return <BaseBox>{collapsibleBodyContent}</BaseBox>;
};

export { AccordionItemBody };
