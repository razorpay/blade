/* eslint-disable react/react-in-jsx-scope */

import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { getRazorSenseProgram } from './razorSensePrograms';
import type { RazorSenseTarget } from './razorSenseMotionTypes';
import { DEFAULT_CDN_PATH } from './utils';
import { useTheme } from '~components/BladeProvider';

type RazorSenseStaticFrameProps = {
  target: RazorSenseTarget;
  assetsPath?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
  /** Changes when the host needs readiness for a new occurrence of the same URL. */
  readinessKey?: string;
  onReady?: () => void;
  onError?: (error: Error) => void;
};

type StaticFrameLayer = {
  key: string;
  colorScheme: 'light' | 'dark';
  desktop: string;
  mobile: string;
  objectPosition: string;
};

type StaticFrameLayerState = {
  presented: StaticFrameLayer;
  pending?: StaticFrameLayer;
};

const resolveAssetUrl = (assetsPath: string, file: string): string =>
  `${assetsPath.replace(/\/$/, '')}/${file.replace(/^\//, '')}`;

const RazorSenseStaticFrame = forwardRef<HTMLDivElement, RazorSenseStaticFrameProps>(
  function RazorSenseStaticFrame(props, forwardedRef) {
    const {
      target,
      assetsPath = DEFAULT_CDN_PATH,
      width = '100%',
      height = '100%',
      className,
      style,
      readinessKey,
      onReady,
      onError,
    } = props;
    const { colorScheme } = useTheme();
    const program = getRazorSenseProgram(target);
    const stills = program.representativeStills[colorScheme];
    const desktop = resolveAssetUrl(assetsPath, stills.desktop.file);
    const mobile = resolveAssetUrl(assetsPath, stills.mobile.file);
    const settledKeyRef = useRef<string>();
    const settlementKey = `${readinessKey ?? program.id}:${colorScheme}:${desktop}:${mobile}`;
    const requestedLayer: StaticFrameLayer = {
      key: settlementKey,
      colorScheme,
      desktop,
      mobile,
      objectPosition: stills.desktop.objectPosition,
    };
    const requestedKeyRef = useRef(settlementKey);
    const imageRefs = useRef(new Map<string, HTMLImageElement>());
    const [layerState, setLayerState] = useState<StaticFrameLayerState>(() => ({
      presented: requestedLayer,
    }));
    requestedKeyRef.current = settlementKey;

    useEffect(() => {
      setLayerState((current) => {
        if (current.presented.key === settlementKey || current.pending?.key === settlementKey) {
          return current;
        }
        return { presented: current.presented, pending: requestedLayer };
      });
    }, [colorScheme, desktop, mobile, requestedLayer.objectPosition, settlementKey]);

    const reportReady = useCallback(
      (layer: StaticFrameLayer): void => {
        if (requestedKeyRef.current !== layer.key) return;
        setLayerState((current) =>
          current.pending?.key === layer.key ? { presented: current.pending } : current,
        );
        if (settledKeyRef.current === layer.key) return;
        settledKeyRef.current = layer.key;
        onReady?.();
      },
      [onReady],
    );

    const reportError = useCallback(
      (layer: StaticFrameLayer, currentSource?: string): void => {
        if (requestedKeyRef.current !== layer.key) return;
        setLayerState((current) =>
          current.pending?.key === layer.key ? { presented: current.presented } : current,
        );
        if (settledKeyRef.current === layer.key) return;
        settledKeyRef.current = layer.key;
        onError?.(
          new Error(
            `RazorSense: Failed to load representative frame ${currentSource ?? layer.desktop}`,
          ),
        );
      },
      [onError],
    );

    useEffect(() => {
      const image = imageRefs.current.get(settlementKey);
      if (!image?.complete) return;
      const layer =
        layerState.pending?.key === settlementKey
          ? layerState.pending
          : layerState.presented.key === settlementKey
          ? layerState.presented
          : undefined;
      if (!layer) return;
      if (image.naturalWidth > 0) reportReady(layer);
      else reportError(layer, image.currentSrc);
    }, [layerState, reportError, reportReady, settlementKey]);

    const layers = layerState.pending
      ? [layerState.presented, layerState.pending]
      : [layerState.presented];

    return (
      <div
        ref={forwardedRef}
        className={className}
        data-razor-sense-static-frame={program.id}
        data-razor-sense-color-scheme={colorScheme}
        style={{
          position: 'relative',
          overflow: 'hidden',
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          ...style,
        }}
      >
        {layers.map((layer) => (
          <picture key={layer.key}>
            <source media="(max-width: 809.98px)" srcSet={layer.mobile} />
            <img
              crossOrigin="anonymous"
              ref={(image) => {
                if (image) imageRefs.current.set(layer.key, image);
                else imageRefs.current.delete(layer.key);
              }}
              src={layer.desktop}
              alt=""
              aria-hidden="true"
              draggable={false}
              onLoad={() => reportReady(layer)}
              onError={({ currentTarget }) => reportError(layer, currentTarget.currentSrc)}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: layer.objectPosition,
                opacity: layer.key === layerState.presented.key ? 1 : 0,
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            />
          </picture>
        ))}
      </div>
    );
  },
);

export { RazorSenseStaticFrame };
export type { RazorSenseStaticFrameProps };
