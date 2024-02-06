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
const PEEK_GUTTER = 16;
const DEFAULT_OFFSET = 8;
const SCALE_FACTOR = 0.05;
const MAX_TOASTS = 3;

const StyledToastWrapper = styled.div<{ isVisible: boolean; index: number; isExpanded: boolean }>(
  ({ isVisible, index, isExpanded }) => {
    // const activeStyle = isVisible
    //   ? ({
    //       zIndex: 9999,
    //       '& > *': {
    //         pointerEvents: 'auto',
    //       },
    //     } as const)
    //   : ({} as const);
    const indexLimit = isExpanded ? 1 : index < 3 + MAX_TOASTS ? 1 : 0;
    const isUnderMax = index < MAX_TOASTS;

    return {
      // ...activeStyle,
      '& > *': {
        pointerEvents: isExpanded ? 'auto' : isUnderMax ? 'auto' : undefined,
      },
      opacity: isVisible ? indexLimit : 0,
    };
  },
);

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
  const isExpanded = isMouseOver;

  React.useLayoutEffect(() => {
    // find the first toast which is visible
    setFrontToastHeight(
      toasts.find((t, index) => t.visible && index === MAX_TOASTS - 1)?.height ?? 0,
    );
  }, [toasts]);

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
      const relevantToasts = toasts.filter(
        (t) => (t.position || defaultPosition) === (toast.position || defaultPosition) && t.height,
      );
      const toastIndex = relevantToasts.findIndex((t) => t.id === toast.id);
      const toastsBefore = relevantToasts.filter((toast, i) => i < toastIndex && toast.visible)
        .length;

      const scale =
        index < MAX_TOASTS ? 1 : Math.max(0.7, 2 - ((toastsBefore - 1) * SCALE_FACTOR + 1));
      // y position of toast,
      const offset = relevantToasts
        .filter((toast) => toast.visible)
        .slice(...(reverseOrder ? [toastsBefore + 1] : [0, toastsBefore]))
        .reduce((acc, toast, index) => {
          const minToastsToShow = index < MAX_TOASTS - 1;
          const gutter = minToastsToShow ? GUTTER : PEEK_GUTTER;
          if (isExpanded) {
            return acc + (toast.height || 0) + GUTTER;
          }
          // for the first 3 toasts we don't need to peek, instead we will add the height of those toasts as is
          const threeHeights = minToastsToShow ? toast.height : 0;
          return acc + (toastsBefore + threeHeights!) + gutter;
        }, 0);

      return { offset, scale: isExpanded ? 1 : scale };
    },
    [isExpanded, toasts],
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
          height: isExpanded ? totalHeight : frontToastHeight,
          bottom: 0,
          left: 0,
          position: 'absolute',
          zIndex: -100,
        }}
      />
      {toasts.map((toast, index) => {
        const toastPosition = toast.position ?? position;
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

        // isExpanded ? toast.height : index > 0 ? frontToastHeight : toast.height
        let toastHeight = toast.height;
        if (index > MAX_TOASTS - 1) {
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
            style={{
              ...positionStyle,
              zIndex: -1 * index,
              height: toastHeight,
            }}
          >
            {resolveValue(toast.message, { ...toast, index })}
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
