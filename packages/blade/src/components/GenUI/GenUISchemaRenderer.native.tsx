/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { throwBladeError } from '~utils/logger';

// Type definitions for React Native (placeholder)
type GenUISchemaRendererProps = any;

const GenUISchemaRenderer = (_props: GenUISchemaRendererProps): React.ReactElement => {
  throwBladeError({
    message: 'GenUISchemaRenderer is not yet implemented for React Native',
    moduleName: 'GenUISchemaRenderer',
  });

  return <></>;
};

const ComponentRenderer = (_props: { component?: any; index: number }): React.ReactElement => {
  throwBladeError({
    message: 'ComponentRenderer is not yet implemented for React Native',
    moduleName: 'ComponentRenderer',
  });

  return <></>;
};

export { GenUISchemaRenderer, ComponentRenderer };
export type { GenUISchemaRendererProps };
