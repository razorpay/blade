import type { ToastPosition, ToasterProps, Toast } from 'react-hot-toast';
import { resolveValue, useToaster } from 'react-hot-toast';
import React from 'react';
import styled from 'styled-components';
import {
  PEEKS,
  MAX_TOASTS,
  SCALE_FACTOR,
  GUTTER,
  PEEK_GUTTER,
  TOAST_MAX_WIDTH,
  TOAST_Z_INDEX,
  MIN_TOAST_MOBILE,
  MIN_TOAST_DESKTOP,
  CONTAINER_GUTTER_MOBILE,
  CONTAINER_GUTTER_DESKTOP,
} from './constants';
import { makeMotionTime, makeSize, useTheme } from '~utils';
import BaseBox from '~components/Box/BaseBox';
import type { Theme } from '~components/BladeProvider';
import { useIsMobile } from '~utils/useIsMobile';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

type CalculateYPositionProps = {
  toast: Toast;
  index: number;
  isExpanded: boolean;
  reverseOrder?: boolean;
};

const StyledToastWrapper = styled(BaseBox)<{
  isVisible: boolean;
  index: number;
  isExpanded: boolean;
  isPromotional: boolean;
}>(({ isVisible, index, isExpanded, isPromotional }) => {
  let opacity = isVisible ? 1 : 0;
  // Only make the PEEKING and MAX_TOASTS toasts visible,
  // Every other toasts should be hidden
  if (index < PEEKS + MAX_TOASTS) {
    opacity = 1;
  } else if (isPromotional || isExpanded) {
    opacity = 1;
  } else {
    opacity = 0;
  }

  return {
    '& > *': {
      pointerEvents: opacity === 1 ? 'auto' : 'none',
    },
    opacity,
  };
});

const getPositionStyle = (
  position: ToastPosition,
  offset: number,
  scale: number,
  theme: Theme,
): React.CSSProperties => {
  const top = position.includes('top');
  const verticalStyle: React.CSSProperties = top ? { top: 0 } : { bottom: 0 };
  const horizontalStyle: React.CSSProperties = position.includes('center')
    ? {
        justifyContent: 'center',
      }
    : position.includes('right')
    ? {
        justifyContent: 'flex-end',
      }
    : {};

  return {
    left: 0,
    right: 0,
    display: 'flex',
    position: 'absolute',
    transformOrigin: 'center',
    transition: `${makeMotionTime(theme.motion.duration.gentle)} ${theme.motion.easing.standard}`,
    transitionProperty: 'transform, opacity, height',
    transform: `translateY(${offset * (top ? 1 : -1)}px) scale(${scale})`,
    ...verticalStyle,
    ...horizontalStyle,
  };
};

function isPromotionalToast(toast: Toast): boolean {
  // @ts-expect-error
  return toast.type == 'promotional';
}

const Toaster: React.FC<ToasterProps> = ({
  reverseOrder,
  position = 'top-center',
  toastOptions,
  containerClassName,
  ...rest
}) => {
  const { toasts, handlers } = useToaster(toastOptions);
  const { theme } = useTheme();
  const [frontToastHeight, setFrontToastHeight] = React.useState(0);
  const [hasManuallyExpanded, setHasManuallyExpanded] = React.useState(false);
  const isMobile = useIsMobile();
  const minToasts = isMobile ? MIN_TOAST_MOBILE : MIN_TOAST_DESKTOP;
  const containerGutter = isMobile ? CONTAINER_GUTTER_MOBILE : CONTAINER_GUTTER_DESKTOP;

  const infoToasts = React.useMemo(() => toasts.filter((toast) => !isPromotionalToast(toast)), [
    toasts,
  ]);
  const promoToasts = React.useMemo(() => toasts.filter((toast) => isPromotionalToast(toast)), [
    toasts,
  ]);

  // always keep promo toasts at the bottom of the stack
  const recomputedToasts = React.useMemo(() => [...infoToasts, ...promoToasts], [
    infoToasts,
    promoToasts,
  ]);

  const hasPromoToast = promoToasts.length > 0 && promoToasts[0]?.visible;
  const promoToastHeight = promoToasts[0]?.height ?? 0;
  const isExpanded = hasManuallyExpanded || recomputedToasts.length <= minToasts;

  React.useLayoutEffect(() => {
    // find the first toast which is visible
    const firstToast = infoToasts.find((t, index) => t.visible && index === 0);
    if (firstToast) {
      setFrontToastHeight(firstToast.height ?? 0);
    }
  }, [infoToasts]);

  // calculate total height of all toasts
  const totalHeight = React.useMemo(() => {
    return (
      recomputedToasts
        // only consider visible recomputedToasts
        .filter((toast) => toast.visible)
        .reduce((prevHeight, toast) => prevHeight + (toast.height ?? 0), 0) +
      recomputedToasts.length * GUTTER
    );
  }, [recomputedToasts]);

  // Stacking logic explained in detail:
  // https://www.loom.com/share/522d9a445e2f41e1886cce4decb9ab9d?sid=4287acf6-8d44-431b-93e1-c1a0d40a0aba
  //
  // 1. 3 toasts can be stacked on top of each other
  // 2. After 3 toasts, the toasts will be scaled down and peek from behind
  // 3. There can be maximum of 3 toasts peeking from behind
  // 4. After 3 peeking toasts, the toasts will be hidden
  // 5. If there is a promo toast, all toasts will be lifted up
  // 6. Promo toasts will always be on the bottom
  const calculateYPosition = React.useCallback(
    ({ toast, index }: CalculateYPositionProps) => {
      // find the current toast index
      const toastIndex = infoToasts.findIndex((t) => t.id === toast.id);
      // number of toasts before this toast
      const toastsBefore = infoToasts.filter((toast, i) => i < toastIndex && toast.visible).length;

      let scale = Math.max(0.7, 1 - toastsBefore * SCALE_FACTOR);
      // first toast should always have a scale of 1
      if (index < MAX_TOASTS) {
        scale = 1;
      }

      // y position of toast,
      let offset = infoToasts
        .filter((toast) => toast.visible)
        .slice(0, toastsBefore)
        .reduce((y, toast) => {
          // if the toast is expanded, add the height of the toast + gutter
          if (isExpanded) {
            return y + (toast.height ?? 0) + GUTTER;
          }
          // if the toast is not expanded, add only the peek gutter
          return y + PEEK_GUTTER;
        }, 0);

      // lift all info toasts up if there is a promo toast
      if (hasPromoToast) {
        offset += GUTTER + promoToastHeight;
      }

      // if this is a promo toast, then put it at the bottom and force the scale to 1
      if (isPromotionalToast(toast)) {
        offset = 0;
        scale = 1;
      }

      return { offset, scale: isExpanded ? 1 : scale };
    },
    [hasPromoToast, infoToasts, isExpanded, promoToastHeight],
  );

  const handleMouseEnter = (): void => {
    if (isMobile) return;
    setHasManuallyExpanded(true);
    handlers.startPause();
  };

  const handleMouseLeave = (): void => {
    if (isMobile) return;
    setHasManuallyExpanded(false);
    handlers.endPause();
  };

  const handleToastClick = (): void => {
    if (!isMobile) return;
    setHasManuallyExpanded((prev) => {
      const next = !prev;
      if (next) {
        handlers.startPause();
      } else {
        handlers.endPause();
      }
      return next;
    });
  };

  return (
    <BaseBox
      position="fixed"
      zIndex={TOAST_Z_INDEX}
      top={makeSize(containerGutter)}
      left={makeSize(containerGutter)}
      right={makeSize(containerGutter)}
      bottom={makeSize(containerGutter)}
      width={`calc(100% - ${containerGutter * 2}px)`}
      maxWidth={makeSize(TOAST_MAX_WIDTH)}
      pointerEvents="none"
      className={containerClassName}
      {...metaAttribute({ name: MetaConstants.ToastContainer })}
      {...makeAnalyticsAttribute(rest)}
    >
      {/*
       * Mouseover container,
       * fills in the gap between toasts so that mouseleave doesn't trigger in the gaps
       */}
      <BaseBox
        position="absolute"
        bottom={`${promoToastHeight}px`}
        left="0px"
        width="100%"
        pointerEvents={isExpanded ? 'all' : 'none'}
        height={makeSize(isExpanded ? totalHeight - promoToastHeight : frontToastHeight)}
        zIndex={-100}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleToastClick}
        {...metaAttribute({ testID: 'toast-mouseover-container' })}
      />
      {recomputedToasts.map((toast, index) => {
        const toastPosition = toast.position ?? position;
        const isPromotional = isPromotionalToast(toast);
        const { offset, scale } = calculateYPosition({
          toast,
          isExpanded,
          reverseOrder,
          index,
        });
        const positionStyle = getPositionStyle(toastPosition, offset, scale, theme);
        // recalculate height of toast
        const ref = (el: HTMLDivElement): void => {
          if (el && typeof toast.height !== 'number') {
            const height = el.getBoundingClientRect().height;
            handlers.updateHeight(toast.id, height);
          }
        };

        let toastHeight = toast.height;
        if (index > MAX_TOASTS - 1 && !isPromotional) {
          toastHeight = frontToastHeight;
        }
        if (isExpanded) {
          toastHeight = toast.height;
        }

        return (
          <StyledToastWrapper
            key={toast.id}
            index={index}
            ref={ref}
            isExpanded={isExpanded}
            isVisible={toast.visible}
            isPromotional={isPromotional}
            style={{
              ...positionStyle,
              zIndex: -1 * index,
              height: toastHeight,
              overflow: 'hidden',
            }}
            onMouseEnter={() => {
              if (isPromotional) return;
              handleMouseEnter();
            }}
            onMouseLeave={() => {
              if (isPromotional) return;
              handleMouseLeave();
            }}
            onClick={() => {
              if (isPromotional) return;
              handleToastClick();
            }}
          >
            <BaseBox height="fit-content" width="100%">
              {resolveValue(toast.message, { ...toast, index })}
            </BaseBox>
          </StyledToastWrapper>
        );
      })}
    </BaseBox>
  );
};

const ToastContainer = (): React.ReactElement => {
  return <Toaster position="bottom-left" />;
};

export { ToastContainer };
