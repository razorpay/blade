import type { ModalProps } from './Modal';

const modalMaxWidth: Record<NonNullable<ModalProps['size']>, number> = {
  small: 400,
  medium: 760,
  large: 1024,
};

const modalMinWidth = 320;

export { modalMaxWidth, modalMinWidth };
