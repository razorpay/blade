import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import type {
  PreviewWindowProps,
  PreviewHeaderProps,
  PreviewFooterProps,
  PreviewBodyProps,
} from './types';
import BaseBox from '~components/Box/BaseBox';
import { Heading } from '~components/Typography';
import { IconButton } from '~components/Button/IconButton';
import {
  FullScreenEnterIcon,
  ZoomInIcon,
  ZoomOutIcon,
  FullScreenExitIcon,
} from '~components/Icons';
import { ButtonGroup } from '~components/ButtonGroup';
import { Button } from '~components/Button';

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
    <BaseBox display="flex" backgroundColor="surface.background.gray.intense" padding="spacing.2">
      <ButtonGroup>
        <Button icon={ZoomInIcon} color="primary" />
        <Button icon={ZoomOutIcon} color="primary" />
      </ButtonGroup>
      {trailing}
    </BaseBox>
  );
};

const PreviewWindow = (PreviewWindowProps: PreviewWindowProps): React.ReactElement => {
  const [zoom, setZoom] = useState(1);
  const { children } = PreviewWindowProps;
  console.log('children', children);

  return (
    <TransformWrapper>
      {({ zoomIn, zoomOut, resetTransfor }) => (
        <BaseBox width="100%" height="100%">
          {/* <PreviewHeader title="Preview" /> */}
          <BaseBox
            display="flex"
            backgroundColor="surface.background.gray.intense"
            padding="spacing.2"
          >
            <ButtonGroup>
              <Button icon={ZoomInIcon} color="primary" onClick={() => zoomIn()} />
              <Button icon={ZoomOutIcon} color="primary" onClick={() => zoomOut()} />
            </ButtonGroup>
            {/* {trailing} */}
          </BaseBox>
          <BaseBox cursor="grab" width="100%" height="100%">
            <TransformComponent width="100%" height="100%">
              {children}
            </TransformComponent>
          </BaseBox>
          <PreviewFooter
            showZoomPercentage={true}
            trailing={<Button icon={FullScreenExitIcon} />}
          />
        </BaseBox>
      )}
    </TransformWrapper>
  );
};

export { PreviewWindow, PreviewHeader, PreviewBody, PreviewFooter };
