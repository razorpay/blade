import React, { createContext, useContext, useCallback, useMemo } from 'react';
import type {
  PreviewBodyProps,
  PreviewFooterProps,
  PreviewHeaderProps,
  PreviewProps,
} from './types';
import { PreviewProvider, usePreviewContext } from './PreviewContext';
import BaseBox from '~components/Box/BaseBox';
import { Heading } from '~components/Typography';
import { Button } from '~components/Button';
import { Divider } from '~components/Divider';
import {
  ZoomInIcon,
  ZoomOutIcon,
  RefreshIcon,
  MaximizeIcon,
  MinimizeIcon,
} from '~components/Icons';
import { Text } from '~components/Typography';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { useControllableState } from '~utils/useControllable';

// Native zoom controls context (replaces web's react-zoom-pan-pinch useControls)
type NativePreviewControls = {
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  zoomPercentage: number;
};
const NativePreviewControlsContext = createContext<NativePreviewControls>({
  zoomIn: () => {},
  zoomOut: () => {},
  resetZoom: () => {},
  zoomPercentage: 100,
});

const PreviewHeader = ({ title, trailing, testID }: PreviewHeaderProps): React.ReactElement => {
  const { isFullScreen, _onFullScreen } = usePreviewContext();

  return (
    <BaseBox {...metaAttribute({ name: MetaConstants.PreviewHeader, testID })}>
      <BaseBox
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        paddingX="spacing.4"
        paddingY="spacing.3"
      >
        <BaseBox display="flex" flexDirection="row" alignItems="center" gap="spacing.3" flex="1">
          {title ? (
            <Heading size="small" weight="semibold" truncateAfterLines={1}>
              {title}
            </Heading>
          ) : null}
        </BaseBox>
        <BaseBox display="flex" flexDirection="row" alignItems="center" gap="spacing.2">
          {trailing}
          <Button
            size="small"
            variant="tertiary"
            icon={isFullScreen ? MinimizeIcon : MaximizeIcon}
            onClick={() => _onFullScreen?.(!isFullScreen)}
            accessibilityLabel={isFullScreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          />
        </BaseBox>
      </BaseBox>
      <Divider />
    </BaseBox>
  );
};

const PreviewBody = ({ children, testID }: PreviewBodyProps): React.ReactElement => {
  return (
    <BaseBox flex="1" {...metaAttribute({ name: MetaConstants.PreviewBody, testID })}>
      {children}
    </BaseBox>
  );
};

const PreviewFooter = ({ testID }: PreviewFooterProps): React.ReactElement => {
  const { showZoomPercentage } = usePreviewContext();
  const { zoomIn, zoomOut, resetZoom, zoomPercentage } = useContext(NativePreviewControlsContext);

  return (
    <BaseBox {...metaAttribute({ name: MetaConstants.PreviewFooter, testID })}>
      <Divider />
      <BaseBox
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        gap="spacing.2"
        paddingY="spacing.2"
        paddingX="spacing.4"
      >
        <Button
          size="small"
          variant="tertiary"
          icon={ZoomOutIcon}
          onClick={zoomOut}
          accessibilityLabel="Zoom out"
        />
        {showZoomPercentage ? (
          <Text size="small" weight="medium">
            {Math.round(zoomPercentage)}%
          </Text>
        ) : null}
        <Button
          size="small"
          variant="tertiary"
          icon={ZoomInIcon}
          onClick={zoomIn}
          accessibilityLabel="Zoom in"
        />
        <Button
          size="small"
          variant="tertiary"
          icon={RefreshIcon}
          onClick={resetZoom}
          accessibilityLabel="Reset zoom"
        />
      </BaseBox>
    </BaseBox>
  );
};

const _Preview = (
  {
    children,
    zoom,
    defaultZoom = 1,
    onZoomChange,
    zoomScaleStep = 0.1,
    showZoomPercentage = true,
    isDragAndZoomDisabled = false,
    testID,
  }: PreviewProps,
  ref: React.Ref<unknown>,
): React.ReactElement => {
  const [currentZoom, setCurrentZoom] = useControllableState({
    value: zoom,
    defaultValue: defaultZoom,
    onChange: (z) => onZoomChange?.({ zoom: z }),
  });

  const [isFullScreen, setIsFullScreen] = React.useState(false);

  const zoomIn = useCallback(() => {
    if (isDragAndZoomDisabled) return;
    setCurrentZoom((prev) => Math.min((prev ?? 1) + zoomScaleStep, 8));
  }, [isDragAndZoomDisabled, zoomScaleStep, setCurrentZoom]);

  const zoomOut = useCallback(() => {
    if (isDragAndZoomDisabled) return;
    setCurrentZoom((prev) => Math.max((prev ?? 1) - zoomScaleStep, 0.1));
  }, [isDragAndZoomDisabled, zoomScaleStep, setCurrentZoom]);

  const resetZoom = useCallback(() => {
    setCurrentZoom(() => defaultZoom);
  }, [defaultZoom, setCurrentZoom]);

  const controlsValue = useMemo(
    () => ({
      zoomIn,
      zoomOut,
      resetZoom,
      zoomPercentage: (currentZoom ?? 1) * 100,
    }),
    [zoomIn, zoomOut, resetZoom, currentZoom],
  );

  const previewContextValue = useMemo(
    () => ({
      isFullScreen,
      showZoomPercentage,
      _onFullScreen: setIsFullScreen,
    }),
    [isFullScreen, showZoomPercentage],
  );

  // Filter children by componentId
  let headerChild: React.ReactNode = null;
  let bodyChild: React.ReactNode = null;
  let footerChild: React.ReactNode = null;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    const id = getComponentId(child);
    if (id === 'PreviewHeader') headerChild = child;
    else if (id === 'PreviewBody') bodyChild = child;
    else if (id === 'PreviewFooter') footerChild = child;
  });

  return (
    <PreviewProvider value={previewContextValue}>
      <NativePreviewControlsContext.Provider value={controlsValue}>
        <BaseBox
          ref={ref as never}
          display="flex"
          flexDirection="column"
          flex="1"
          borderWidth="thin"
          borderColor="surface.border.gray.muted"
          borderRadius="medium"
          overflow="hidden"
          {...metaAttribute({ name: MetaConstants.Preview, testID })}
        >
          {headerChild}
          {bodyChild}
          {footerChild}
        </BaseBox>
      </NativePreviewControlsContext.Provider>
    </PreviewProvider>
  );
};

const Preview = assignWithoutSideEffects(React.forwardRef(_Preview), {
  displayName: 'Preview',
  componentId: 'Preview',
});

const PreviewHeaderWithId = assignWithoutSideEffects(PreviewHeader, {
  componentId: 'PreviewHeader',
});

const PreviewBodyWithId = assignWithoutSideEffects(PreviewBody, {
  componentId: 'PreviewBody',
});

const PreviewFooterWithId = assignWithoutSideEffects(PreviewFooter, {
  componentId: 'PreviewFooter',
});

export {
  Preview,
  PreviewHeaderWithId as PreviewHeader,
  PreviewBodyWithId as PreviewBody,
  PreviewFooterWithId as PreviewFooter,
};
