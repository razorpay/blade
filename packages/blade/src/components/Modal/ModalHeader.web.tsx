/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import type { BaseHeaderProps } from '../BaseHeaderFooter/BaseHeader';
import { useModalContext } from './ModalContext';
import { modalHighestZIndex } from './modalTokens';
import { makeSize } from '~utils';
import { BaseHeader } from '~components/BaseHeaderFooter/BaseHeader';
import { BaseBox } from '~components/Box/BaseBox';
import { size } from '~tokens/global';
import { useTheme } from '~components/BladeProvider';
import { IconButton } from '~components/Button/IconButton';
import { CloseIcon } from '~components/Icons';
import { MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

type ModalHeaderProps = Pick<
  BaseHeaderProps,
  'title' | 'subtitle' | 'leading' | 'trailing' | 'titleSuffix'
>;

const _ModalHeader = ({
  leading,
  subtitle,
  title,
  titleSuffix,
  trailing,
}: ModalHeaderProps): React.ReactElement => {
  const { close, defaultInitialFocusRef } = useModalContext();
  const { theme } = useTheme();

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
      backgroundColor={theme.colors.surface.background.level2.lowContrast}
      borderRadius="max"
      zIndex={modalHighestZIndex}
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
    />
  );
};
const ModalHeader = assignWithoutSideEffects(_ModalHeader, {
  componentId: MetaConstants.ModalHeader,
});

export { ModalHeader };
export type { ModalHeaderProps };
