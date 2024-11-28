/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useModalContext } from './ModalContext';
import { componentIds } from './constants';
import type { BaseHeaderProps } from '~components/BaseHeaderFooter/BaseHeader';
import { makeSize } from '~utils';
import { BaseHeader } from '~components/BaseHeaderFooter/BaseHeader';
import { BaseBox } from '~components/Box/BaseBox';
import { size } from '~tokens/global';
import { IconButton } from '~components/Button/IconButton';
import { CloseIcon } from '~components/Icons';
import { MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { componentZIndices } from '~utils/componentZIndices';
import type { DataAnalyticsAttribute } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

type ModalHeaderProps = Pick<
  BaseHeaderProps,
  'title' | 'subtitle' | 'leading' | 'trailing' | 'titleSuffix' | keyof DataAnalyticsAttribute
>;

const _ModalHeader = ({
  leading,
  subtitle,
  title,
  titleSuffix,
  trailing,
  ...rest
}: ModalHeaderProps): React.ReactElement => {
  const { close, defaultInitialFocusRef } = useModalContext();

  const isHeaderEmpty = !(title || subtitle || leading || trailing);
  return isHeaderEmpty ? (
    <BaseBox
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="absolute"
      top="spacing.5"
      right="spacing.5"
      width={makeSize(size[28])}
      height={makeSize(size[28])}
      flexShrink={0}
      backgroundColor="popup.background.subtle"
      borderRadius="max"
      zIndex={componentZIndices.modal}
      {...makeAnalyticsAttribute(rest)}
    >
      <IconButton
        ref={defaultInitialFocusRef}
        size="large"
        icon={CloseIcon}
        accessibilityLabel="Close"
        onClick={close}
      />
    </BaseBox>
  ) : (
    <BaseHeader
      metaComponentName={MetaConstants.ModalHeader}
      title={title}
      subtitle={subtitle}
      leading={leading}
      trailing={trailing}
      titleSuffix={titleSuffix}
      closeButtonRef={defaultInitialFocusRef}
      showCloseButton={true}
      onCloseButtonClick={close}
      {...makeAnalyticsAttribute(rest)}
    />
  );
};
const ModalHeader = assignWithoutSideEffects(_ModalHeader, {
  componentId: componentIds.ModalHeader,
});

export { ModalHeader };
export type { ModalHeaderProps };
