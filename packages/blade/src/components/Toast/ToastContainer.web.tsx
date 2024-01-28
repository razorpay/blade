import { Toaster, ToastBar } from 'react-hot-toast';
import React from 'react';
import type { ToastContainerProps } from './types';

const ToastContainer = ({ position = 'bottom-left' }: ToastContainerProps): React.ReactElement => {
  return <Toaster position={position} />;
};

export { ToastContainer };
