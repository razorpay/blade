/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ToastPosition, ToasterProps, Toast } from 'react-hot-toast';
import { resolveValue, useToaster } from 'react-hot-toast';
import React from 'react';
import styled from 'styled-components';
import type { ToastContainerProps } from './types';

type CalculateYPositionProps = {
  toast: Toast;
  index: number;
  isExpanded: boolean;
  reverseOrder?: boolean;
  defaultPosition?: ToastPosition;
};

const GUTTER = 8;
const PEEK_GUTTER = 14;
const DEFAULT_OFFSET = 8;
const SCALE_FACTOR = 0.05;
const MAX_TOASTS = 1;
const MIN_TOASTS = 3;
const PEEKS = 3;

const StyledToastWrapper = styled.div<{
  isVisible: boolean;
  index: number;
  isExpanded: boolean;
  isPromotional: boolean;
}>(({ isVisible, index, isExpanded, isPromotional }) => {
  let opacity = isVisible ? 1 : 0;
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
    transition: `400ms ease`,
    transitionProperty: 'transform, opacity, height',
    transform: `translateY(${offset * (top ? 1 : -1)}px) scale(${scale})`,
    ...verticalStyle,
    ...horizontalStyle,
  };
};

function isPromotionalToast(toast: Toast) {
  // @ts-expect-error
  return toast.type == 'promotional';
}

const MyToaster: React.FC<ToasterProps> = ({
  reverseOrder,
  position = 'top-center',
  toastOptions,
  containerStyle,
  containerClassName,
}) => {
  const [isMouseOver, setIsMouseOver] = React.useState(false);
  const { toasts, handlers } = useToaster(toastOptions);
  const [frontToastHeight, setFrontToastHeight] = React.useState(0);

  const infoToasts = React.useMemo(
    () => toasts.filter((toast) => !isPromotionalToast(toast) && toast.visible),
    [toasts],
  );
  const promoToasts = React.useMemo(
    () => toasts.filter((toast) => isPromotionalToast(toast) && toast.visible),
    [toasts],
  );
  const hasPromoToast = promoToasts.length > 0;
  const promoToastHeight = promoToasts[0]?.height ?? 0;
  const isExpanded = isMouseOver || toasts.length <= MIN_TOASTS;

  React.useLayoutEffect(() => {
    // find the first toast which is visible
    setFrontToastHeight(infoToasts.find((t, index) => t.visible && index === 0)?.height ?? 0);
  }, [infoToasts]);

  // calculate total height of all toasts
  const totalHeight = React.useMemo(() => {
    return (
      toasts
        // only consider visible toasts
        .filter((toast) => toast.visible)
        .reduce((prevHeight, toast) => prevHeight + (toast.height ?? 0), 0) +
      toasts.length * DEFAULT_OFFSET
    );
  }, [toasts]);

  const calculateYPosition = React.useCallback(
    ({ toast, reverseOrder = false, index, defaultPosition }: CalculateYPositionProps) => {
      const relevantToasts = infoToasts.filter(
        (t) => (t.position || defaultPosition) === (toast.position || defaultPosition) && t.height,
      );
      const toastIndex = relevantToasts.findIndex((t) => t.id === toast.id);
      // number of toasts before this toast
      const toastsBefore = relevantToasts.filter((toast, i) => i < toastIndex && toast.visible)
        .length;

      let scale = index < MAX_TOASTS ? 1 : Math.max(0.7, 2 - (toastsBefore * SCALE_FACTOR + 1));
      // y position of toast,
      let offset = relevantToasts
        .filter((toast) => toast.visible)
        .slice(...(reverseOrder ? [toastsBefore + 1] : [0, toastsBefore]))
        .reduce((acc, toast) => {
          if (isExpanded) {
            return acc + (toast.height || 0) + GUTTER;
          }
          return acc + PEEK_GUTTER;
        }, 0);

      // lift all info toasts up if there is a promo toast
      if (hasPromoToast) {
        offset += GUTTER + promoToastHeight;
      }
      // promo toasts should always be on bottom
      if (isPromotionalToast(toast)) {
        offset = 0;
        scale = 1;
      }

      return { offset, scale: isExpanded ? 1 : scale };
    },
    [hasPromoToast, infoToasts, isExpanded, promoToastHeight],
  );

  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 9999,
        top: DEFAULT_OFFSET,
        left: DEFAULT_OFFSET,
        right: DEFAULT_OFFSET,
        bottom: DEFAULT_OFFSET,
        width: '360px',
        pointerEvents: 'none',
        ...containerStyle,
      }}
      className={containerClassName}
      onMouseEnter={() => {
        setIsMouseOver(true);
        handlers.startPause();
      }}
      onMouseLeave={() => {
        setIsMouseOver(false);
        handlers.endPause();
      }}
    >
      <div
        style={{
          width: '100%',
          pointerEvents: isExpanded ? 'all' : 'none',
          height: isExpanded ? totalHeight : promoToastHeight + frontToastHeight,
          bottom: 0,
          left: 0,
          position: 'absolute',
          zIndex: -100,
        }}
      />
      {toasts.map((toast, index) => {
        const toastPosition = toast.position ?? position;
        const isPromotional = isPromotionalToast(toast);
        const { offset, scale } = calculateYPosition({
          toast,
          isExpanded,
          reverseOrder,
          index,
        });
        const positionStyle = getPositionStyle(toastPosition, offset, scale);
        // recalculate height of toast
        const ref = (el: HTMLDivElement) => {
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
          >
            <div style={{ height: 'fit-content', width: '100%' }}>
              {resolveValue(toast.message, { ...toast, index })}
            </div>
          </StyledToastWrapper>
        );
      })}
    </div>
  );
};

const ToastContainer = ({ position = 'bottom-left' }: ToastContainerProps): React.ReactElement => {
  return <MyToaster position={position} />;
};

export { ToastContainer };
