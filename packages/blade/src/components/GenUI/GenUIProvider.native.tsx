/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { logger } from '~utils/logger';

// Type definitions for React Native (placeholder)
type GenUIProviderProps = any;
type GenUIConfig = any;
type GenUIContextValue = any;
type GenUIComponentRegistry = any;
type GenUIComponentDefinition = any;
type GenUIComponentRenderer = any;
type GenUICustomComponent = any;
type GenUIAction = any;

const GenUIProvider = (_props: GenUIProviderProps): React.ReactElement => {
  logger({
    type: 'warn',
    message: 'GenUIProvider is not yet implemented for React Native',
    moduleName: 'GenUIProvider',
  });

  return <></>;
};

const useGenUI = () => {
  logger({
    type: 'warn',
    message: 'useGenUI is not yet implemented for React Native',
    moduleName: 'useGenUI',
  });

  return {
    registry: {},
    validComponentTypes: [],
  };
};

const useGenUIAction = () => {
  logger({
    type: 'warn',
    message: 'useGenUIAction is not yet implemented for React Native',
    moduleName: 'useGenUIAction',
  });

  return () => {};
};

export { GenUIProvider, useGenUI, useGenUIAction };
export type {
  GenUIProviderProps,
  GenUIConfig,
  GenUIContextValue,
  GenUIComponentRegistry,
  GenUIComponentDefinition,
  GenUIComponentRenderer,
  GenUICustomComponent,
  GenUIAction,
};
