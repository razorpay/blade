import React from 'react';
import type {
  PreviewWindowProps,
  PreviewHeaderProps,
  PreviewFooterProps,
  PreviewBodyProps,
} from './types';
import BaseBox from '~components/Box/BaseBox';
import { Heading } from '~components/Typography';
import { IconButton } from '~components/Button/IconButton';
import { FullScreenEnterIcon } from '~components/Icons';

const PreviewHeader = (PreviewHeaderProps: PreviewHeaderProps): React.ReactElement => {
  const { title } = PreviewHeaderProps;
  return (
    <BaseBox display="flex">
      <Heading> {title}</Heading>
      <IconButton
        icon={FullScreenEnterIcon}
        accessibilityLabel="Close"
        onClick={() => console.log('Clicked')}
      />
    </BaseBox>
  );
};

const PreviewBody = (PreviewBodyProps: PreviewBodyProps): React.ReactElement => {
  const { children } = PreviewBodyProps;
  console.log('children', children);
  return <React.Fragment> {children}</React.Fragment>;
};

const PreviewFooter = (PreviewFooterProps: PreviewFooterProps): React.ReactElement => {
  const { showZoomPercentage, trailing } = PreviewFooterProps;
  return (
    <BaseBox display="flex">
      {showZoomPercentage && <BaseBox> </BaseBox>}
      {trailing}
    </BaseBox>
  );
};

const PreviewWindow = (PreviewWindowProps: PreviewWindowProps): React.ReactElement => {
  const { children } = PreviewWindowProps;
  return <BaseBox>{children}</BaseBox>;
};

export { PreviewWindow, PreviewHeader, PreviewBody, PreviewFooter };
