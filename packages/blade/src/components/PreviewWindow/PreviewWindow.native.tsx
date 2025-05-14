import React from 'react';
import type {
  PreviewBodyProps,
  PreviewFooterProps,
  PreviewHeaderProps,
  PreviewWindowProps,
} from './types';
import { throwBladeError } from '~utils/logger';

const PreviewWindow = (_prop: PreviewWindowProps): React.ReactElement => {
  throwBladeError({
    message: 'PreviewWindow is not yet implemented for native',
    moduleName: 'PreviewWindow',
  });

  return <></>;
};

const PreviewHeader = (_prop: PreviewHeaderProps): React.ReactElement => {
  throwBladeError({
    message: 'PreviewHeader is not yet implemented for native',
    moduleName: 'PreviewHeader',
  });

  return <></>;
};

const PreviewBody = (_prop: PreviewBodyProps): React.ReactElement => {
  throwBladeError({
    message: 'PreviewBody is not yet implemented for native',
    moduleName: 'PreviewBody',
  });

  return <></>;
};

const PreviewFooter = (_prop: PreviewFooterProps): React.ReactElement => {
  throwBladeError({
    message: 'PreviewFooter is not yet implemented for native',
    moduleName: 'PreviewFooter',
  });

  return <></>;
};

export { PreviewWindow, PreviewHeader, PreviewBody, PreviewFooter };
