/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import type { GenUIComponent } from './GenUIComponents';
import { useGenUI, GenUIContext } from './GenUIContext';
import type { AnimateOptions } from './rehypeAnimate';
import { useResize } from '~utils/useResize';

/**
 * Block-level component types that should have the animated gradient border effect
 */
const BLOCK_LEVEL_COMPONENTS = new Set(['CARD', 'TABLE']);

/**
 * Global styles for @property rules needed for CSS animation of custom properties
 * Note: @property is required to animate CSS custom properties (interpolation)
 */
const GlobalAnimationStyles = createGlobalStyle`
  @property --travel-x {
    syntax: '<length>';
    inherits: false;
    initial-value: 0px;
  }
  @property --travel-r {
    syntax: '<angle>';
    inherits: false;
    initial-value: 0deg;
  }
  @property --travel-x2 {
    syntax: '<length>';
    inherits: false;
    initial-value: 0px;
  }
  @property --travel-r2 {
    syntax: '<angle>';
    inherits: false;
    initial-value: 0deg;
  }
`;

/**
 * Static keyframes using CSS variables for positions.
 * Values are passed via inline style: --x-start, --x-end
 * Using ~70% for edge traversal, ~30% for corner sweep (good for typical card aspect ratios)
 */
const travelX = keyframes`
  0% { --travel-x: var(--x-start); }
  70% { --travel-x: var(--x-end); }
  100% { --travel-x: var(--x-end); }
`;

const travelR = keyframes`
  0% { --travel-r: 0deg; }
  70% { --travel-r: 0deg; }
  100% { --travel-r: 180deg; }
`;

const travelX2 = keyframes`
  0% { --travel-x2: var(--x-start); }
  30% { --travel-x2: var(--x-start); }
  100% { --travel-x2: var(--x-end); }
`;

const travelR2 = keyframes`
  0% { --travel-r2: 0deg; }
  30% { --travel-r2: -180deg; }
  100% { --travel-r2: -180deg; }
`;

/** Mask reveal animation - diagonal swipe from top-left to bottom-right */
const maskReveal = keyframes`
  0% {
    mask-position: 100% 100%;
    opacity: 0;
  }
  100% {
    mask-position: 0% 0%;
    opacity: 1;
  }
`;

/** Gradient shade movement - left to right, fades out at end */
const shadeMove = keyframes`
  0% {
    background-position: 0% 50%;
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    background-position: 100% 50%;
    opacity: 0;
  }
`;

/** Container for the animated border effect — owns the vertical margin to keep the ring flush */
const AnimatedBorderContainer = styled.div<{ $showContent?: boolean }>`
  position: relative;
  width: 100%;
  border-radius: 12px;
  margin: 12px 0;
`;

/**
 * The animated gradient border layer - light travels along the border edges.
 * Uses conic-gradient positioned at (--travel-x, 50%) with rotation --travel-r.
 * The animation moves the gradient center along the horizontal axis while
 * rotating it at the corners to create the illusion of perimeter traversal.
 */
const GradientBorder = styled.div<{ $fadeOut?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 12px;
  background: conic-gradient(
      from calc(var(--travel-r) - 50deg) at var(--travel-x) 50%,
      transparent 0%,
      hsl(180 85% 65%) 3%,
      hsl(145 75% 45%) 5%,
      hsl(145 85% 70%) 7%,
      transparent 30%,
      transparent 100%
    ),
    conic-gradient(
      from calc(var(--travel-r2) - 50deg) at var(--travel-x2) 50%,
      transparent 0%,
      hsl(180 85% 65%) 3%,
      hsl(145 75% 45%) 5%,
      hsl(145 85% 70%) 7%,
      transparent 30%,
      transparent 100%
    );
  animation: ${travelX} 1s linear infinite, ${travelR} 1s linear infinite,
    ${travelX2} 1s linear infinite, ${travelR2} 1s linear infinite;
  pointer-events: none;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  padding: 1.5px;
  opacity: ${({ $fadeOut }) => ($fadeOut ? 0 : 1)};
  transition: opacity 3s ease-out;
`;

/** Content container with mask reveal animation */
const ContentContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  /* Diagonal gradient mask for reveal effect - starts hidden, animates to revealed */
  mask-image: linear-gradient(135deg, black 0%, black 45%, transparent 55%);
  mask-size: 300% 300%;
  /* Start position: fully masked (hidden) */
  mask-position: 100% 100%;
  /* Animate to 0% 0% (fully revealed) with ease-out for smooth finish */
  animation: ${maskReveal} 2s ease-out forwards;
  animation-delay: 0.6s;
`;

/** Green linear gradient shade overlay */
const GradientShade = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 12px;
  pointer-events: none;
  z-index: 5;
  background: linear-gradient(
    90deg,
    transparent 0%,
    hsl(145 85% 50% / 0.15) 30%,
    hsl(155 85% 45% / 0.25) 50%,
    hsl(145 85% 50% / 0.15) 70%,
    transparent 100%
  );
  background-size: 50% 100%;
  background-repeat: no-repeat;
  background-position: 0% 50%;
  animation: ${shadeMove} 1.5s ease-out forwards;
  animation-delay: 0.3s;
`;

/**
 * Animated gradient border wrapper for block-level components.
 * Uses CSS variables for dynamic position values with static keyframes (best perf).
 * No dynamic style injection - just pass --x-start and --x-end via inline style.
 */
const AnimatedGradientBorder: React.FC<{
  children: React.ReactNode;
  onAnimationComplete?: () => void;
}> = ({ children, onAnimationComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showContent, setShowContent] = useState(false);
  // Initial default values to prevent animation from breaking before ResizeObserver fires
  const [cssVars, setCssVars] = useState<React.CSSProperties>({
    '--x-start': '50px',
    '--x-end': '500px',
  } as React.CSSProperties);

  useEffect(() => {
    // Trigger border fade-out after mask reveal completes (0.6s delay + 1s animation)
    const timer = setTimeout(() => {
      setShowContent(true);
      onAnimationComplete?.();
    }, 1000);
    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  // Measure container and compute CSS variable values for animation positions.
  // Ring now spans the full container (top: 0, bottom: 0), so rect.height is the ring height.
  const computePositions = useCallback((entry: ResizeObserverEntry) => {
    const { width: w, height } = entry.contentRect;
    const h = height;
    if (w <= 0 || h <= 0) return;

    const xMargin = Math.min(h * 0.5, w * 0.1);
    const xMax = w - xMargin;

    setCssVars({
      '--x-start': `${xMargin.toFixed(1)}px`,
      '--x-end': `${xMax.toFixed(1)}px`,
    } as React.CSSProperties);
  }, []);

  useResize(containerRef, computePositions);

  return (
    <>
      <GlobalAnimationStyles />
      <AnimatedBorderContainer ref={containerRef} $showContent={showContent}>
        <GradientBorder $fadeOut={showContent} style={cssVars} />
        <ContentContainer>
          {children}
          <GradientShade />
        </ContentContainer>
      </AnimatedBorderContainer>
    </>
  );
};

/**
 * Helper to generate a stable key for a component based on its index and type
 */
const getComponentKey = (component: GenUIComponent, index: number): string => {
  if (!component?.component) {
    return `empty-${index}`;
  }
  return `${component.component}-${index}`;
};

type ComponentRendererProps = {
  /** The component schema to render */
  component?: GenUIComponent;
  /** Index of the component in the list */
  index: number;
};

/**
 * Internal component that renders a single GenUI component based on its schema
 * Must be used within a GenUIProvider
 */
const ComponentRenderer = memo(({ component, index }: ComponentRendererProps) => {
  const { registry, validComponentTypes } = useGenUI();

  // Handle incomplete components during streaming
  if (!component?.component) {
    return null;
  }

  const componentType = component.component;
  const key = getComponentKey(component, index);

  // Look up the renderer in the registry
  const definition = registry[componentType];

  if (definition) {
    const Renderer = definition.renderer;
    const isBuiltInBlockLevel = BLOCK_LEVEL_COMPONENTS.has(componentType);
    const isGradientAnimation = definition?.animation?.name === 'gradient-ring-entry';
    const isBlockLevel = isBuiltInBlockLevel || isGradientAnimation;

    // Block-level components get the animated gradient border effect.
    // Built-in components (CARD, TABLE) carry marginY="spacing.4" so need a
    // 13px inset; custom components have no external margin so use 0.
    if (isBlockLevel) {
      return (
        <AnimatedGradientBorder key={key}>
          <Renderer {...component} index={index} />
        </AnimatedGradientBorder>
      );
    }

    return <Renderer key={key} {...component} index={index} />;
  }

  // During streaming, we might get partial component names, ie DIV for DIVIDER or ST for STACK
  // Check if the current component name is a prefix of any valid component name
  const isPotentiallyValidComponentName = validComponentTypes.some((validName) =>
    validName.startsWith(componentType),
  );

  if (isPotentiallyValidComponentName) {
    return null;
  }

  console.warn(`[GenUI]: Unsupported component: ${componentType}`);
  return null;
});

type GenUISchemaRendererProps = {
  /** The components array to render */
  components?: GenUIComponent[];
  /** Whether text animation is active (for streaming) */
  isAnimating?: boolean;
  /** Animation options for text streaming */
  animateOptions?: AnimateOptions;
};

/**
 * Renders an array of GenUI components
 * Must be used within a GenUIProvider
 *
 * @example
 * ```tsx
 * <GenUIProvider>
 *   <GenUISchemaRenderer components={[...]} isAnimating={isStreaming} />
 * </GenUIProvider>
 * ```
 */
const GenUISchemaRenderer = memo(
  ({ components, isAnimating, animateOptions }: GenUISchemaRendererProps) => {
    const parentContext = useGenUI();

    if (!components || components.length === 0) {
      return null;
    }

    // Create a new context value with animation state overrides
    const contextValue = {
      ...parentContext,
      isAnimating: isAnimating ?? parentContext.isAnimating,
      animateOptions: animateOptions ?? parentContext.animateOptions,
    };

    return (
      <GenUIContext.Provider value={contextValue}>
        <>
          {components.map((component, index) => (
            <ComponentRenderer
              key={getComponentKey(component, index)}
              component={component}
              index={index}
            />
          ))}
        </>
      </GenUIContext.Provider>
    );
  },
);

export { GenUISchemaRenderer, ComponentRenderer };
export type { GenUISchemaRendererProps };
