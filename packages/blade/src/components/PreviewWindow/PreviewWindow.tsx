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
import { Heading, Text } from '~components/Typography';
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
  return <BaseBox padding="spacing.5"> {children}</BaseBox>;
};

const PreviewBody = assignWithoutSideEffects(_PreviewBody, {
  componentId: MetaConstants.PreviewBody,
});

const _PreviewFooter = (PreviewFooterProps: PreviewFooterProps): React.ReactElement => {
  const { showZoomPercentage, trailing } = PreviewFooterProps;
  const { instance, zoomIn, zoomOut, resetTransform, ...rest } = useControls();
  const { zoom, onZoomChange, zoomScaleStep } = usePreviewWindowContext();
  return (
    <BaseBox
      display="flex"
      justifyContent="space-between"
      width="100%"
      //TODO: look into this
      backgroundColor="white"
      position="absolute"
      bottom="spacing.0"
      left="spacing.0"
      right="spacing.0"
      padding="spacing.5"
      zIndex={1000}
    >
      <BaseBox>
        {showZoomPercentage ? (
          <BaseBox display="flex" alignItems="center" gap="spacing.2">
            <Button
              icon={ZoomInIcon}
              onClick={() => {
                zoomIn(zoomScaleStep);
              }}
              variant="tertiary"
              aria-label="Zoom in"
              isDisabled={zoom >= 8}
            />
            <Text size="medium"> {Math.round(zoom * 100)}%</Text>
            <Button
              icon={ZoomOutIcon}
              onClick={() => {
                zoomOut();
              }}
              variant="tertiary"
              aria-label="Zoom out"
              isDisabled={zoom <= 0.1}
            />
            <Button
              //TODO: Ask RK for Reset Icon
              icon={ResizerIcon}
              onClick={() => resetTransform()}
              variant="tertiary"
              aria-label="Reset zoom"
            />
          </BaseBox>
        ) : (
          <ButtonGroup variant="tertiary">
            <Button
              icon={ZoomInIcon}
              onClick={() => {
                zoomIn(zoomScaleStep);
              }}
            />

            <Button
              icon={ZoomOutIcon}
              onClick={() => {
                zoomOut();
              }}
            />
          </ButtonGroup>
        )}
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
const PreviewWindow = ({
  children,
  onFullScreen: onFullScreenProp,
  onZoomChange,
  zoomScaleStep = 0.1,
}: PreviewWindowProps): React.ReactElement => {
  const [zoom, setZoom] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullScreen(true);
      onFullScreenProp?.();
    } else {
      document.exitFullscreen().catch((err) => {
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

  const handleZoomChange = useCallback(
    (zoomLevel: number) => {
      setZoom(zoomLevel);
      onZoomChange?.(zoomLevel);
    },
    [onZoomChange],
  );

  const handleTransformed = ({ state }: { state: { scale: number } }): void => {
    const { scale } = state;
    handleZoomChange(scale);
  };

  return (
    <PreviewWindowProvider value={{ zoom, isFullScreen, zoomScaleStep }}>
      <BaseBox
        ref={containerRef}
        width="100%"
        height="100%"
        position="relative"
        overflow="hidden"
        backgroundColor="surface.background.gray.moderate"
      >
        <TransformWrapper
          width="100%"
          height="100%"
          centerOnInit
          onTransformed={handleTransformed}
          minScale={0.1}
          maxScale={8}
        >
          {() => (
            <BaseBox width="100%" height="100%" position="relative">
              {previewFooter}
              {previewHeader}
              <ZoomContainer>
                <TransformComponent wrapperClass="zoom-wrapper" contentClass="zoom-content">
                  {previewBody}
                </TransformComponent>
              </ZoomContainer>
            </BaseBox>
          )}
        </TransformWrapper>
      </BaseBox>
    </PreviewWindowProvider>
  );
};

export { PreviewWindow, PreviewHeader, PreviewBody, PreviewFooter };
