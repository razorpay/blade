/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ToastPosition, ToasterProps, Toast } from 'react-hot-toast';
import { resolveValue, useToaster } from 'react-hot-toast';
import React from 'react';
import styled from 'styled-components';
import type { ToastContainerProps } from './types';
import { usePrevious } from '~utils';

type ToastWrapperProps = {
  isVisible: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
  index: number;
};

const StyledToastWrapper = styled.div<{ isVisible: boolean; index: number }>(
  ({ isVisible, index }) => {
    const activeStyle = isVisible
      ? ({
          zIndex: 9999,
          '& > *': {
            pointerEvents: 'auto',
          },
        } as const)
      : {};
    return {
      ...activeStyle,
      opacity: isVisible ? (index < 3 ? 1 : 0) : 0,
    };
  },
);

const ToastWrapper = React.forwardRef<HTMLDivElement, ToastWrapperProps>(
  ({ style, isVisible, children, index }, ref) => {
    return (
      <StyledToastWrapper index={index} ref={ref} isVisible={isVisible} style={style}>
        {children}
      </StyledToastWrapper>
    );
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

const DEFAULT_OFFSET = 16;

const MyToaster: React.FC<ToasterProps> = ({
  reverseOrder,
  position = 'top-center',
  toastOptions,
  gutter,
  // children,
  containerStyle,
  containerClassName,
}) => {
  const [isMouseOver, setIsMouseOver] = React.useState(false);
  const { toasts, handlers } = useToaster(toastOptions);
  const [frontToastHeight, setFrontToastHeight] = React.useState(0);
  const scrollViewRef = React.useRef<HTMLDivElement>(null);
  const [totalHeight, setTotalHeight] = React.useState(0);
  const prevHeight = usePrevious(totalHeight);

  React.useLayoutEffect(() => {
    setFrontToastHeight(toasts.find((t) => t.visible)?.height ?? 0);
  }, [toasts]);

  React.useLayoutEffect(() => {
    const calculated =
      toasts.reduce((prev, curr) => {
        return prev + (curr.height ?? 0);
      }, 0) +
      toasts.length * DEFAULT_OFFSET;

    if (!prevHeight) {
      setTotalHeight(calculated);
      return;
    }
    if (calculated > prevHeight) {
      setTotalHeight(calculated);
    }
  }, [prevHeight, toasts]);

  React.useLayoutEffect(() => {
    if (scrollViewRef.current && !isMouseOver) {
      scrollViewRef.current.scrollTo({
        top: totalHeight,
      });
    }
  }, [isMouseOver, toasts.length, totalHeight]);
  const calculateOffset = React.useCallback(
    (
      toast: Toast,
      index: number,
      opts?: {
        reverseOrder?: boolean;
        gutter?: number;
        defaultPosition?: ToastPosition;
      },
    ) => {
      const { reverseOrder = false, gutter = 16, defaultPosition } = opts || {};

      const relevantToasts = toasts.filter(
        (t) => (t.position || defaultPosition) === (toast.position || defaultPosition) && t.height,
      );
      const toastIndex = relevantToasts.findIndex((t) => t.id === toast.id);
      const toastsBefore = relevantToasts.filter((toast, i) => i < toastIndex && toast.visible)
        .length;

      const offset = relevantToasts
        .filter((t) => t.visible)
        .slice(...(reverseOrder ? [toastsBefore + 1] : [0, toastsBefore]))
        .reduce((acc) => acc + (toastsBefore || 0) + gutter, 0);
      const scale = 2 - (toastsBefore * 0.05 + 1);

      return { offset, scale };
    },
    [toasts],
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
      {toasts.map((t, index) => {
        const toastPosition = t.position ?? position;
        const { offset, scale } = calculateOffset(t, index, {
          reverseOrder,
          gutter,
        });
        const positionStyle = getPositionStyle(toastPosition, offset, scale);
        const ref = (el: HTMLDivElement) => {
          if (el && typeof t.height !== 'number') {
            const height = el.getBoundingClientRect().height;
            handlers.updateHeight(t.id, height);
          }
        };

        return (
          <ToastWrapper
            index={index}
            ref={ref}
            key={t.id}
            style={{
              ...positionStyle,
              zIndex: -1 * index,
              height: index > 0 ? frontToastHeight : t.height,
            }}
            isVisible={t.visible}
          >
            {resolveValue(t.message, { ...t, index })}
          </ToastWrapper>
        );
      })}
    </div>
  );
};

const ToastContainer = ({ position = 'bottom-left' }: ToastContainerProps): React.ReactElement => {
  return <MyToaster position={position} />;
};

export { ToastContainer };
