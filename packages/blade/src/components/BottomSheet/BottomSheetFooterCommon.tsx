/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { ComponentIds } from './componentIds';
import type { BottomSheetFooterLeadingProps, BottomSheetFooterTrailingProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { Text } from '~components/Typography';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';

const _BottomSheetFooterLeading = ({
  title,
  prefix,
}: BottomSheetFooterLeadingProps): React.ReactElement => {
  return (
    <BaseBox display="flex" alignItems="center" flexDirection="row" userSelect="none">
      {prefix && (
        <BaseBox marginRight="spacing.4" display="flex" alignSelf="center">
          {prefix}
        </BaseBox>
      )}
      {title && (
        <BaseBox>
          <Text variant="body" size="medium" weight="regular">
            {title}
          </Text>
        </BaseBox>
      )}
    </BaseBox>
  );
};

const BottomSheetFooterLeading = assignWithoutSideEffects(_BottomSheetFooterLeading, {
  componentId: ComponentIds.BottomSheetFooterLeading,
});

const _BottomSheetFooterTrailing = ({
  actions,
  hasLeading,
}: BottomSheetFooterTrailingProps): React.ReactElement => {
  const { primary, secondary } = actions || {};

  return (
    <BaseBox
      marginLeft="auto"
      display="flex"
      flexDirection="row"
      alignSelf="auto"
      width={hasLeading ? 'auto' : '100%'}
    >
      {secondary ? (
        <BaseBox flexGrow={1}>
          <Button
            isFullWidth
            size="medium"
            variant="secondary"
            type={secondary.type}
            accessibilityLabel={secondary.accessibilityLabel}
            isLoading={secondary.isLoading}
            isDisabled={secondary.isDisabled}
            icon={secondary.icon}
            iconPosition={secondary.iconPosition}
            onClick={secondary.onClick}
          >
            {secondary.text!}
          </Button>
        </BaseBox>
      ) : null}
      {secondary && primary ? <BaseBox marginLeft="spacing.5" /> : null}
      {primary ? (
        <BaseBox flexGrow={1}>
          <Button
            isFullWidth
            size="medium"
            type={primary.type}
            accessibilityLabel={primary.accessibilityLabel}
            isLoading={primary.isLoading}
            isDisabled={primary.isDisabled}
            icon={primary.icon}
            iconPosition={primary.iconPosition}
            onClick={primary.onClick}
          >
            {primary.text!}
          </Button>
        </BaseBox>
      ) : null}
    </BaseBox>
  );
};
const BottomSheetFooterTrailing = assignWithoutSideEffects(_BottomSheetFooterTrailing, {
  componentId: ComponentIds.BottomSheetFooterTrailing,
});

export { BottomSheetFooterLeading, BottomSheetFooterTrailing };
