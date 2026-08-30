import React from 'react';

/**
 * Returns `true` when the user has requested that the system minimize the amount
 * of non-essential motion (OS-level "Reduce Motion" setting or
 * `prefers-reduced-motion: reduce` browser preference).
 *
 * For components built with BaseMotion / framer-motion (Scale, Stagger,
 * AnimateInteractions, etc.), reduced motion is handled automatically by
 * BladeProvider — no manual check is required.
 *
 * Use this hook when you need to conditionally control CSS transitions,
 * canvas animations, or any custom animation logic:
 *
 * ```tsx
 * const prefersReducedMotion = useReducedMotion();
 *
 * <Box
 *   transitionDuration={prefersReducedMotion ? 'duration.2xquick' : 'duration.moderate'}
 * />
 * ```
 *
 * The hook subscribes to OS-level changes, so the component re-renders if the
 * user toggles the setting without a page reload.
 */
const useReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = ({ matches }: MediaQueryListEvent): void => {
      setPrefersReducedMotion(matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return (): void => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
};

export { useReducedMotion };
