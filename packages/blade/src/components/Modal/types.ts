import type { DataAnalyticsAttribute } from '~utils/types';

export type ModalProps = {
  /**
   *  Children of Modal
   * Only ModalHeader, ModalBody and ModalFooter are allowed as children
   */
  children: React.ReactNode;
  /**
   Sets the modal to open or close
   * @default false
   */
  isOpen: boolean;
  /**
   *  Callback function when user clicks on close button or outside the modal or on pressing escape key.
   */
  onDismiss: () => void;
  /**
   *  Ref to the element to be focused on opening the modal.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialFocusRef?: React.MutableRefObject<any>;
  /**
   *  Size of the modal
   * @default 'small'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   *  Accessibility label for the modal
   */
  accessibilityLabel?: string;
  /**
   * Sets the z-index of the modal
   * @default 1000
   */
  zIndex?: number;
} & DataAnalyticsAttribute;
