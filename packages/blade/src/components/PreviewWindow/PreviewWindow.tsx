import React, { useState } from 'react';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';
import type {
  PreviewWindowProps,
  PreviewHeaderProps,
  PreviewFooterProps,
  PreviewBodyProps,
} from './types';
import { usePreviewWindowContext, PreviewWindowProvider } from './PreviewWindowContext';
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
  const { instance, zoomIn, zoomOut, ...rest } = useControls();
  console.log('instance', instance);
  console.log('zoomIn', zoomIn);
  console.log('zoomOut', zoomOut);
  console.log('rest', rest);
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
  const { instance, zoomIn, zoomOut, ...rest } = useControls();
  console.log('instance', instance);
  console.log('zoomIn', zoomIn);
  console.log('zoomOut', zoomOut);
  console.log('rest', rest);
  console.log('showZoomPercentage', showZoomPercentage);
  return (
    <BaseBox display="flex" justifyContent="space-between" width="100%">
      <ButtonGroup variant="tertiary">
        <Button icon={ZoomInIcon} onClick={() => zoomIn()} />
        <Button icon={ZoomOutIcon} onClick={() => zoomOut()} />
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
    <PreviewWindowProvider value={{ zoom, onZoomChange: setZoom }}>
      <TransformWrapper>
        {() => (
          <BaseBox width="100%" height="100%" backgroundColor="surface.background.gray.intense">
            <BaseBox cursor="grab" width="100%" height="100%">
              <TransformComponent width="100%" height="100%">
                {children}
              </TransformComponent>
            </BaseBox>
            <PreviewFooter
              showZoomPercentage={true}
              trailing={<Button icon={FullScreenExitIcon} variant="tertiary" />}
            />
          </BaseBox>
        )}
      </TransformWrapper>
    </PreviewWindowProvider>
  );
};

export { PreviewWindow, PreviewHeader, PreviewBody, PreviewFooter };
