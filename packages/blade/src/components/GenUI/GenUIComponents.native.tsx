/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { throwBladeError } from '~utils/logger';

// Type definitions for React Native (placeholder)
export type GenUIComponent = any;
export type GenUIBaseComponent = any;

// Placeholder component that throws error
const GenUIComponentsNotSupported = (): React.ReactElement => {
  throwBladeError({
    message: 'GenUI Components are not yet implemented for React Native',
    moduleName: 'GenUIComponents',
  });

  return <></>;
};

export { GenUIComponentsNotSupported };
