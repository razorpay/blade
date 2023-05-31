import type { ModalProps } from './Modal';
import { size } from '~tokens/global';
import type { Border, Size } from '~tokens/global';
import type { DotNotationSpacingStringToken } from '~src/_helpers/types';

const modalMaxWidth: Record<NonNullable<ModalProps['size']>, Size[keyof Size]> = {
  small: size[400],
  medium: size[760],
  large: size[1024],
};

const modalMinWidth = 320;

const modalResponsiveScreenGap: Size[keyof Size] = size[48];

const modalContentPadding: DotNotationSpacingStringToken = 'spacing.6';

const modalBorderRadius: keyof Border['radius'] = 'large';

export {
  modalMaxWidth,
  modalMinWidth,
  modalResponsiveScreenGap,
  modalBorderRadius,
  modalContentPadding,
};
