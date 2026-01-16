/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import { throwBladeError } from '~utils/logger';

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
  throwBladeError({
    message: 'GenUIProvider is not yet implemented for React Native',
    moduleName: 'GenUIProvider',
  });

  return <></>;
};

const useGenUI = () => {
  throwBladeError({
    message: 'useGenUI is not yet implemented for React Native',
    moduleName: 'useGenUI',
  });

  return {
    registry: {},
    validComponentTypes: [],
  };
};

const useGenUIAction = () => {
  throwBladeError({
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