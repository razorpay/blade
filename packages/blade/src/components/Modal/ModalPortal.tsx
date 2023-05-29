import { createPortal } from 'react-dom';

type ModalPortalProps = {
  children: React.ReactNode;
};

const createModalRootWrapper = (id: string): HTMLElement => {
  const element = document.createElement('div');
  element.setAttribute('id', id);
  document.body.appendChild(element);
  return element;
};

const ModalPortal = ({ children }: ModalPortalProps): React.ReactElement => {
  const wrapperID = 'modal-root-portal';
  let element = document.getElementById(wrapperID);
  if (!element) {
    element = createModalRootWrapper(wrapperID);
  }

  return createPortal(children, element);
};

export { ModalPortal };
