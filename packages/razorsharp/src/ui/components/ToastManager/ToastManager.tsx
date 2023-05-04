import type { FunctionComponent } from 'preact';
import { ToastContext } from '../../providers/Toast';
import './ToastManager.css';

export const ToastManager: FunctionComponent = () => {
  return (
    <ToastContext.Consumer>
      {({ toasts }) => {
        return (
          <div className="toast__container">
            {toasts.map((toast) => (
              <div key={toast.id} className="toast__message">
                {toast.message}
              </div>
            ))}
          </div>
        );
      }}
    </ToastContext.Consumer>
  );
};
