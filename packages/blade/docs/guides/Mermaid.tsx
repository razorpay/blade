import React from 'react';

// Mermaid is loaded from a CDN at runtime (Storybook-only) rather than being added as an
// npm dependency. This keeps its heavy transitive deps (d3 and its `@types/d3-*` typings,
// which use TS 5.0 syntax incompatible with blade's TypeScript) out of the published
// package's type-generation build.
const MERMAID_CDN_URL = 'https://cdn.jsdelivr.net/npm/mermaid@11.16.0/dist/mermaid.esm.min.mjs';

type MermaidApi = {
  initialize: (config: Record<string, unknown>) => void;
  render: (id: string, chart: string) => Promise<{ svg: string }>;
};

let mermaidPromise: Promise<MermaidApi> | null = null;

const loadMermaid = async (): Promise<MermaidApi> => {
  if (!mermaidPromise) {
    mermaidPromise = import(/* @vite-ignore */ MERMAID_CDN_URL).then((mod) => {
      const mermaid = (mod.default ?? mod) as MermaidApi;
      mermaid.initialize({
        startOnLoad: false,
        theme: 'neutral',
        securityLevel: 'loose',
        flowchart: { htmlLabels: true, curve: 'basis', useMaxWidth: true },
        fontFamily: 'inherit',
      });
      return mermaid;
    });
  }
  return mermaidPromise;
};

type MermaidProps = {
  chart: string;
};

/**
 * Renders a Mermaid diagram from a chart definition string.
 * Intended for use inside Storybook MDX guide pages only.
 */
export const Mermaid = ({ chart }: MermaidProps): React.ReactElement => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const idRef = React.useRef(`mermaid-${Math.random().toString(36).slice(2)}`);

  React.useEffect(() => {
    let isMounted = true;

    const renderChart = async (): Promise<void> => {
      try {
        const mermaid = await loadMermaid();
        const { svg } = await mermaid.render(idRef.current, chart);
        if (isMounted && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (error) {
        if (isMounted && containerRef.current) {
          containerRef.current.textContent = `Failed to render diagram: ${String(error)}`;
        }
      }
    };

    void renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}
    />
  );
};
