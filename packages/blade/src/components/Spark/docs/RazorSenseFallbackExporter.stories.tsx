/* eslint-disable react/react-in-jsx-scope */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { useEffect, useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import { RazorSenseAuthored } from '../RzpGlass/RazorSenseAuthored';
import { RazorSenseMood } from '../RzpGlass/RazorSenseMood';
import {
  RAZOR_SENSE_MODES,
  isRazorSenseEmotionalMode,
  isRazorSenseOperationalMode,
} from '../RzpGlass/modes';
import type { RazorSenseMode } from '../RzpGlass/modes';
import { getRazorSenseRepresentativeFrame } from '../RzpGlass/razorSenseAssets';
import type { RazorSenseViewport } from '../RzpGlass/razorSenseAssets';
import { BladeProvider } from '~components/BladeProvider';
import { bladeTheme } from '~tokens/theme';
import type { ColorSchemeNames } from '~tokens/theme';

const COLOR_SCHEMES: readonly ColorSchemeNames[] = ['light', 'dark'];
const VIEWPORTS: readonly RazorSenseViewport[] = ['desktop', 'mobile'];
const ASSETS_PATH = '/assets/spark';

type ExportRequest = {
  mode: RazorSenseMode;
  colorScheme: ColorSchemeNames;
  viewport: RazorSenseViewport;
};

type ParsedExportRequest =
  | { request: ExportRequest; error?: never }
  | { request?: never; error: string };

const readSingleParam = (params: URLSearchParams, name: string): string => {
  const values = params.getAll(name);
  if (values.length !== 1 || values[0] === '') {
    throw new Error(`Expected exactly one non-empty \"${name}\" query parameter.`);
  }
  return values[0];
};

const parseExportRequest = (): ParsedExportRequest => {
  try {
    const params = new URLSearchParams(window.location.search);
    const mode = readSingleParam(params, 'mode');
    const colorScheme = readSingleParam(params, 'colorScheme');
    const viewport = readSingleParam(params, 'viewport');

    if (!RAZOR_SENSE_MODES.includes(mode as RazorSenseMode)) {
      throw new Error(`Invalid mode \"${mode}\".`);
    }
    if (!COLOR_SCHEMES.includes(colorScheme as ColorSchemeNames)) {
      throw new Error(`Invalid colorScheme \"${colorScheme}\".`);
    }
    if (!VIEWPORTS.includes(viewport as RazorSenseViewport)) {
      throw new Error(`Invalid viewport \"${viewport}\".`);
    }
    if (viewport === 'mobile' && isRazorSenseOperationalMode(mode as RazorSenseMode)) {
      throw new Error(`Operational mode \"${mode}\" does not support the mobile viewport.`);
    }

    return {
      request: {
        mode: mode as RazorSenseMode,
        colorScheme: colorScheme as ColorSchemeNames,
        viewport: viewport as RazorSenseViewport,
      },
    };
  } catch (cause: unknown) {
    return {
      error: cause instanceof Error ? cause.message : String(cause),
    };
  }
};

const ExportError = ({ message }: { message: string }): ReactElement => (
  <div
    data-error={message}
    data-export-error={message}
    role="alert"
    style={{
      position: 'fixed',
      inset: 0,
      display: 'grid',
      placeItems: 'center',
      padding: 24,
      color: '#8A1126',
      background: '#FFF1F3',
      font: '600 16px/1.5 sans-serif',
    }}
  >
    RazorSense fallback export error: {message}
  </div>
);

const RazorSenseFallbackExporter = (): ReactElement => {
  const parsed = useMemo(parseExportRequest, []);
  const [isFrameReady, setIsFrameReady] = useState(false);
  const [isExportReady, setIsExportReady] = useState(false);
  const [exportError, setExportError] = useState<string>();

  useEffect(() => {
    if (!isFrameReady) return undefined;

    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => setIsExportReady(true));
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame) window.cancelAnimationFrame(secondFrame);
    };
  }, [isFrameReady]);

  if (parsed.error) return <ExportError message={parsed.error} />;

  const { mode, colorScheme, viewport } = parsed.request;
  const representativeFrame = getRazorSenseRepresentativeFrame({
    assetsPath: ASSETS_PATH,
    mode,
    colorScheme,
    viewport,
  });
  const rendererProps = {
    assetsPath: ASSETS_PATH,
    width: '100%',
    height: '100%',
    paused: true,
    startTime: representativeFrame.phase,
    interactive: false,
    onFrameReady: () => setIsFrameReady(true),
    onError: (error: Error) => setExportError(error.message),
  } as const;

  return (
    <BladeProvider themeTokens={bladeTheme} colorScheme={colorScheme}>
      <div
        data-razor-sense-export
        data-export-ready={isExportReady ? 'true' : undefined}
        data-export-error={exportError}
        data-mode={mode}
        data-color-scheme={colorScheme}
        data-viewport={viewport}
        data-representative-frame={representativeFrame.file}
        data-representative-phase={representativeFrame.phase}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: representativeFrame.width,
          height: representativeFrame.height,
          overflow: 'hidden',
        }}
      >
        {isRazorSenseOperationalMode(mode) ? (
          <RazorSenseAuthored {...rendererProps} mode={mode} />
        ) : null}
        {isRazorSenseEmotionalMode(mode) ? <RazorSenseMood {...rendererProps} mode={mode} /> : null}
      </div>
    </BladeProvider>
  );
};

export default {
  title: 'Components/RazorSense/Fallback Exporter',
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: false },
    chromatic: { disableSnapshot: true },
  },
} as Meta;

export const Exporter: StoryFn = () => <RazorSenseFallbackExporter />;
