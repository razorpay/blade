import React from 'react';
import type {
  PreviewBodyProps,
  PreviewFooterProps,
  PreviewHeaderProps,
  PreviewWindowProps,
} from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const PreviewWindow = (_prop: PreviewWindowProps): React.ReactElement => {
  throwBladeError({
    message: 'PreviewWindow is not yet implemented for native',
    moduleName: 'PreviewWindow',
  });

  return <Text>PreviewWindow is not available for Native mobile apps.</Text>;
};

const PreviewHeader = (_prop: PreviewHeaderProps): React.ReactElement => {
  throwBladeError({
    message: 'PreviewHeader is not yet implemented for native',
    moduleName: 'PreviewHeader',
  });

  return <Text>PreviewHeader is not available for Native mobile apps.</Text>;
};

const PreviewBody = (_prop: PreviewBodyProps): React.ReactElement => {
  throwBladeError({
    message: 'PreviewBody is not yet implemented for native',
    moduleName: 'PreviewBody',
  });

  return <Text>PreviewBody is not available for Native mobile apps.</Text>;
};

const PreviewFooter = (_prop: PreviewFooterProps): React.ReactElement => {
  throwBladeError({
    message: 'PreviewFooter is not yet implemented for native',
    moduleName: 'PreviewFooter',
  });

  return <Text>PreviewFooter is not available for Native mobile apps.</Text>;
};

export { PreviewWindow, PreviewHeader, PreviewBody, PreviewFooter };
