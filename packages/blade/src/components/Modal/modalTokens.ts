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

const modalMaxHeight = '80vh';

const modalResponsiveScreenGap: Size[keyof Size] = size[48];

const modalBodyPadding: DotNotationSpacingStringToken = 'spacing.6';

const modalBorderRadius: keyof Border['radius'] = 'large';

const scrollOverlayHeight: Size[keyof Size] = size[56];

const modalHighestZIndex = 1000;

export {
  modalMaxWidth,
  modalMinWidth,
  modalResponsiveScreenGap,
  modalBorderRadius,
  modalBodyPadding,
  modalMaxHeight,
  scrollOverlayHeight,
  modalHighestZIndex,
};
