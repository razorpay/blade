import React, { useState, useCallback } from 'react';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';
import styled from 'styled-components';
import type {
  PreviewWindowProps,
  PreviewHeaderProps,
  PreviewFooterProps,
  PreviewBodyProps,
} from './types';
import { usePreviewWindowContext, PreviewWindowProvider } from './PreviewWindowContext';
import BaseBox from '~components/Box/BaseBox';
import {
  FullScreenEnterIcon,
  ZoomInIcon,
  ZoomOutIcon,
  FullScreenExitIcon,
  ResizerIcon,
} from '~components/Icons';
import { Heading } from '~components/Typography';
import { ButtonGroup } from '~components/ButtonGroup';
import { Button } from '~components/Button';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { MetaConstants } from '~utils/metaAttribute';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { Divider } from '~components/Divider';
const _PreviewHeader = (PreviewHeaderProps: PreviewHeaderProps): React.ReactElement => {
  const { title, _onFullScreen } = PreviewHeaderProps;
  const { instance, zoomIn, zoomOut, ...rest } = useControls();
  const { isFullScreen } = usePreviewWindowContext();
  return (
    <BaseBox>
      <BaseBox
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding="spacing.5"
      >
        <Heading size="medium"> {title}</Heading>
        <Button
          icon={isFullScreen ? FullScreenExitIcon : FullScreenEnterIcon}
          variant="tertiary"
          onClick={_onFullScreen}
        />
      </BaseBox>
      <Divider orientation="horizontal" />
    </BaseBox>
  );
};

const PreviewHeader = assignWithoutSideEffects(_PreviewHeader, {
  componentId: MetaConstants.PreviewHeader,
});

const _PreviewBody = (PreviewBodyProps: PreviewBodyProps): React.ReactElement => {
  const { children } = PreviewBodyProps;
  console.log('children', children);
  return <BaseBox padding="spacing.5"> {children}</BaseBox>;
};

const PreviewBody = assignWithoutSideEffects(_PreviewBody, {
  componentId: MetaConstants.PreviewBody,
});

const _PreviewFooter = (PreviewFooterProps: PreviewFooterProps): React.ReactElement => {
  const { showZoomPercentage, trailing } = PreviewFooterProps;
  const { instance, zoomIn, zoomOut, resetTransform, ...rest } = useControls();
  return (
    <BaseBox
      display="flex"
      justifyContent="space-between"
      width="100%"
      //TODO: look into this
      backgroundColor="white"
    >
      <BaseBox>
        <Button icon={ZoomInIcon} onClick={() => zoomIn()} variant="tertiary" />
        <Button icon={ZoomOutIcon} onClick={() => zoomOut()} variant="tertiary" />
      </BaseBox>
      <Button icon={ResizerIcon} onClick={() => resetTransform()} variant="tertiary" />
      {trailing}
    </BaseBox>
  );
};

const PreviewFooter = assignWithoutSideEffects(_PreviewFooter, {
  componentId: MetaConstants.PreviewFooter,
});

const dotSpacing = 16;
const dotOpacity = 0.1;
const dotSize = 1;
const ZoomContainer = styled.div`
  width: 100%;
  height: 100%;
  cursor: grab;
  background-image: radial-gradient(
    circle,
    rgba(0, 0, 0, ${dotOpacity}) ${dotSize}px,
    transparent ${dotSize}px
  );
  background-size: ${dotSpacing}px ${dotSpacing}px;
  .zoom-wrapper,
  .zoom-content {
    width: 100%;
    height: 100%;
  }
`;
const PreviewWindow = (PreviewWindowProps: PreviewWindowProps): React.ReactElement => {
  const [zoom, setZoom] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { children, onFullScreen: onFullScreenProp } = PreviewWindowProps;

  const handleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        //TODO: maybe use blade error component here
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullScreen(true);
      onFullScreenProp?.();
    } else {
      document.exitFullscreen().catch((err) => {
        //TODO: maybe use blade error component here
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
      setIsFullScreen(false);
      onFullScreenProp?.();
    }
  }, [onFullScreenProp]);

  // this is added to handle the fullscreen change if user exits fullscreen using the escape key, or browser's exit fullscreen button
  React.useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  // filter out preview header, preview body, preview footer separately using componentId
  const previewHeader = React.Children.toArray(children.props.children)
    .filter((child) => getComponentId(child as React.ReactElement) === MetaConstants.PreviewHeader)
    .map((child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          //TODO: look into this
          // @ts-expect-error
          _onFullScreen: handleFullScreen,
        });
      }
      return child;
    });

  const previewBody = React.Children.toArray(children.props.children).filter(
    (child) => getComponentId(child as React.ReactElement) === MetaConstants.PreviewBody,
  );

  const previewFooter = React.Children.toArray(children.props.children).filter(
    (child) => getComponentId(child as React.ReactElement) === MetaConstants.PreviewFooter,
  );
  return (
    <PreviewWindowProvider value={{ zoom, onZoomChange: setZoom, isFullScreen }}>
      <BaseBox width="100%" height="100%" position="relative">
        <TransformWrapper width="100%" height="100%">
          {() => (
            // <BaseBox width="100%" height="100%" backgroundColor="surface.background.gray.intense">

            <BaseBox
              width="100%"
              height="100%"
              position="relative"
              backgroundColor="surface.background.gray.moderate"
            >
              {previewHeader}
              <ZoomContainer>
                <TransformComponent wrapperClass="zoom-wrapper" contentClass="zoom-content">
                  {previewBody}
                </TransformComponent>
              </ZoomContainer>
              {previewFooter}
            </BaseBox>
          )}
        </TransformWrapper>
      </BaseBox>
    </PreviewWindowProvider>
  );
};

export { PreviewWindow, PreviewHeader, PreviewBody, PreviewFooter };
