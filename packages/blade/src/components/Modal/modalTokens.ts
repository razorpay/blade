import type { ModalProps } from './Modal';
import { size } from '~tokens/global';
import type { Border, Size } from '~tokens/global';

type ModalSizeWithoutFull = Exclude<NonNullable<ModalProps['size']>, 'full'>;

const modalMaxWidth: Record<ModalSizeWithoutFull, Size[keyof Size] | string> = {
  small: size[400],
  medium: size[760],
  large: size[1024],
};

const modalMinWidth = 320;

const modalMaxHeight: Record<ModalSizeWithoutFull, string> = {
  small: '80vh',
  medium: '80vh',
  large: '80vh',
};

const modalResponsiveScreenGap: Size[keyof Size] = size[48];

const modalBorderRadius: keyof Border['radius'] = 'large';

const modalMargin: Record<NonNullable<ModalProps['size']>, Size[keyof Size]> = {
  small: size[0],
  medium: size[0],
  large: size[0],
  full: size[8],
};

const scrollOverlayHeight: Size[keyof Size] = size[56];

export {
  modalMaxWidth,
  modalMinWidth,
  modalResponsiveScreenGap,
  modalBorderRadius,
  modalMaxHeight,
  modalMargin,
  scrollOverlayHeight,
};
