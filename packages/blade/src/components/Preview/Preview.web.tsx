import React, { useState, useCallback, useEffect } from 'react';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';
import styled from 'styled-components';
import type {
  PreviewProps,
  PreviewHeaderProps,
  PreviewFooterProps,
  PreviewBodyProps,
} from './types';
import { usePreviewContext, PreviewProvider } from './PreviewContext';
import BaseBox from '~components/Box/BaseBox';
import {
  FullScreenEnterIcon,
  ZoomInIcon,
  ZoomOutIcon,
  FullScreenExitIcon,
  RefreshIcon,
} from '~components/Icons';
import { Heading, Text } from '~components/Typography';
import { ButtonGroup } from '~components/ButtonGroup';
import { Button } from '~components/Button';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { MetaConstants } from '~utils/metaAttribute';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { Divider } from '~components/Divider';
import { useControllableState } from '~utils/useControllable';
import { componentZIndices } from '~utils/componentZIndices';

const _PreviewHeader = ({
  title,
  _onFullScreen,
  trailing,
}: PreviewHeaderProps): React.ReactElement => {
  const { isFullScreen } = usePreviewContext();

  if (!title) {
    return (
      <BaseBox
        position="absolute"
        top="spacing.0"
        right="spacing.2"
        zIndex={componentZIndices.previewPanel}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding="spacing.4"
      >
        <BaseBox backgroundColor="surface.background.gray.moderate" borderRadius="medium">
          <Button
            icon={isFullScreen ? FullScreenExitIcon : FullScreenEnterIcon}
            variant="tertiary"
            onClick={_onFullScreen}
          />
        </BaseBox>
        {trailing}
      </BaseBox>
    );
  }
  return (
    <BaseBox
      zIndex={componentZIndices.previewPanel}
      position="absolute"
      top="spacing.0"
      left="spacing.0"
      backgroundColor="surface.background.gray.moderate"
      width="100%"
    >
      <BaseBox
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding="spacing.5"
        height="100%"
        width="100%"
      >
        <Heading size="medium" weight="regular" color="surface.text.gray.subtle">
          {title}
        </Heading>
        <BaseBox display="flex" alignItems="center" gap="spacing.3">
          <Button
            icon={isFullScreen ? FullScreenExitIcon : FullScreenEnterIcon}
            variant="tertiary"
            onClick={_onFullScreen}
          />
          {trailing}
        </BaseBox>
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
  return <BaseBox>{children}</BaseBox>;
};

const PreviewBody = assignWithoutSideEffects(_PreviewBody, {
  componentId: MetaConstants.PreviewBody,
});

const _PreviewFooter = (PreviewFooterProps: PreviewFooterProps): React.ReactElement => {
  const { showZoomPercentage, trailing } = PreviewFooterProps;
  const { zoomIn, zoomOut, centerView } = useControls();
  const { zoom, zoomScaleStep, defaultZoom } = usePreviewContext();
  const handleZoomIn = useCallback(() => {
    zoomIn(zoomScaleStep);
  }, [zoomScaleStep, zoomIn]);

  const handleZoomOut = useCallback(() => {
    zoomOut(zoomScaleStep);
  }, [zoomScaleStep, zoomOut]);

  const handleReset = useCallback(() => {
    // thanks to https://github.com/BetterTyped/react-zoom-pan-pinch/issues/286#issuecomment-1442888219
    centerView(defaultZoom, 0);
  }, [defaultZoom, centerView]);

  return (
    <BaseBox
      display="flex"
      justifyContent="space-between"
      width="100%"
      backgroundColor="surface.background.gray.moderate"
      position="absolute"
      bottom="spacing.0"
      left="spacing.0"
      right="spacing.0"
      padding="spacing.5"
      zIndex={componentZIndices.previewPanel}
      borderTopWidth="thin"
      borderTopColor="surface.border.gray.muted"
    >
      <BaseBox
        padding="spacing.2"
        backgroundColor="surface.background.gray.intense"
        borderRadius="medium"
        borderWidth="thin"
        borderColor="surface.border.gray.muted"
      >
        {showZoomPercentage ? (
          <BaseBox display="flex" alignItems="center" gap="spacing.2">
            <Button
              icon={ZoomInIcon}
              onClick={handleZoomIn}
              variant="tertiary"
              aria-label="Zoom in"
              isDisabled={zoom >= 8}
            />
            <Text size="medium"> {Math.round(zoom * 100)}%</Text>
            <Button
              icon={ZoomOutIcon}
              onClick={handleZoomOut}
              variant="tertiary"
              aria-label="Zoom out"
              isDisabled={zoom <= 0.1}
            />
            <Button
              icon={RefreshIcon}
              onClick={() => handleReset()}
              variant="tertiary"
              aria-label="Reset zoom"
            />
          </BaseBox>
        ) : (
          <BaseBox display="flex" alignItems="center" gap="spacing.2">
            <ButtonGroup variant="tertiary">
              <Button icon={ZoomInIcon} onClick={handleZoomIn} aria-label="Zoom in" />
              <Button icon={ZoomOutIcon} onClick={handleZoomOut} aria-label="Zoom out" />
            </ButtonGroup>
            <Button
              icon={RefreshIcon}
              onClick={() => handleReset()}
              aria-label="Reset zoom"
              variant="tertiary"
            />
          </BaseBox>
        )}
      </BaseBox>
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
const ZoomContainer = styled.div<{ isDragEnabled: boolean; isDragging: boolean }>`
  width: 100%;
  height: 100%;
  cursor: ${({ isDragEnabled, isDragging }) => {
    if (!isDragEnabled) return 'default';
    return isDragging ? 'grabbing' : 'grab';
  }};
  background-image: ${({ isDragEnabled }) =>
    isDragEnabled
      ? `radial-gradient(
    circle,
    rgba(0, 0, 0, ${dotOpacity}) ${dotSize}px,
    transparent ${dotSize}px
  )`
      : 'none'};
  background-size: ${dotSpacing}px ${dotSpacing}px;
  .zoom-wrapper,
  .zoom-content {
    width: 100%;
    height: 100%;
    overflow: visible;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  transition: cursor 0.1s ease;
`;

const TransFormWrapperContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.surface.background.gray.moderate};
`;
const Preview = ({
  children,
  onFullScreen: onFullScreenProp,
  onZoomChange,
  zoomScaleStep = 0.1,
  isDragAndZoomDisabled = false,
  defaultZoom,
  onDragChange,
}: PreviewProps): React.ReactElement => {
  const [controlledZoom, setControlledZoom] = useControllableState({
    onChange: onZoomChange,
    defaultValue: defaultZoom ?? 1,
  });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleTransformed = ({
    state,
  }: {
    state: { scale: number; positionX: number; positionY: number };
  }): void => {
    const { scale, positionX, positionY } = state;
    setControlledZoom(() => scale);
    onDragChange?.({ x: positionX, y: positionY });
  };

  const handleFullScreenError = (err: unknown): void => {
    if (err instanceof DOMException) {
      console.error(`Fullscreen request failed: ${err.name} - ${err.message}`);
    } else {
      console.error('Unexpected error during fullscreen request:', err);
    }
  };

  const handleFullScreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      try {
        await containerRef.current?.requestFullscreen();
        setIsFullScreen(true);
        onFullScreenProp?.();
      } catch (err: unknown) {
        handleFullScreenError(err);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullScreen(false);
        onFullScreenProp?.();
      } catch (err: unknown) {
        handleFullScreenError(err);
      }
    }
  }, [onFullScreenProp]);

  // Handle keyboard shortcut for fullscreen
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'f') {
        event.preventDefault();
        void handleFullScreen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleFullScreen]);

  // this is added to handle the fullscreen change if user exits fullscreen using the escape key, or browser's exit fullscreen button
  useEffect(() => {
    const handleFullScreenChange = (): void => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  // filter out preview header, preview body, preview footer separately using componentId
  const previewHeader = React.Children.toArray(children)
    .filter((child) => getComponentId(child as React.ReactElement) === MetaConstants.PreviewHeader)
    .map((child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          // @ts-expect-error
          _onFullScreen: handleFullScreen,
        });
      }
      return child;
    });

  const previewBody = React.Children.toArray(children).filter(
    (child) => getComponentId(child as React.ReactElement) === MetaConstants.PreviewBody,
  );

  const previewFooter = React.Children.toArray(children).filter(
    (child) => getComponentId(child as React.ReactElement) === MetaConstants.PreviewFooter,
  );

  return (
    <PreviewProvider
      value={{
        zoom: controlledZoom,
        isFullScreen,
        zoomScaleStep,
        defaultZoom: defaultZoom ?? 1,
      }}
    >
      <TransFormWrapperContainer ref={containerRef}>
        <TransformWrapper
          onTransformed={handleTransformed}
          minScale={0.1}
          maxScale={8}
          disabled={isDragAndZoomDisabled}
          initialScale={defaultZoom ?? controlledZoom}
          doubleClick={{ disabled: false }}
          onPanningStart={() => setIsDragging(true)}
          onPanningStop={() => setIsDragging(false)}
          panning={{ velocityDisabled: true }}
          limitToBounds={false}
          centerOnInit={true}
        >
          {() => (
            <BaseBox width="100%" height="100%" position="relative" overflow="visible">
              {previewFooter}
              {previewHeader}
              <ZoomContainer isDragEnabled={!isDragAndZoomDisabled} isDragging={isDragging}>
                <TransformComponent wrapperClass="zoom-wrapper" contentClass="zoom-content">
                  {previewBody}
                </TransformComponent>
              </ZoomContainer>
            </BaseBox>
          )}
        </TransformWrapper>
      </TransFormWrapperContainer>
    </PreviewProvider>
  );
};

export { Preview, PreviewHeader, PreviewBody, PreviewFooter };
