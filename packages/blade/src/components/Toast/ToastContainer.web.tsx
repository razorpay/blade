/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ToastPosition, ToasterProps } from 'react-hot-toast';
import { resolveValue, useToaster } from 'react-hot-toast';
import React from 'react';
import { css } from 'styled-components';
import type { ToastContainerProps } from './types';

type ToastWrapperProps = {
  id: string;
  className?: string;
  style?: React.CSSProperties;
  onHeightUpdate: (id: string, height: number) => void;
  children: React.ReactNode;
};
const ToastWrapper = ({ id, className, style, onHeightUpdate, children }: ToastWrapperProps) => {
  const ref = React.useCallback(
    (el: HTMLElement | null) => {
      if (el) {
        const updateHeight = () => {
          const height = el.getBoundingClientRect().height;
          onHeightUpdate(id, height);
        };
        updateHeight();
        new MutationObserver(updateHeight).observe(el, {
          subtree: true,
          childList: true,
          characterData: true,
        });
      }
    },
    [id, onHeightUpdate],
  );

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
};

const getPositionStyle = (position: ToastPosition, offset: number): React.CSSProperties => {
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
    transition: `all 230ms cubic-bezier(.21,1.02,.73,1)`,
    transform: `translateY(${offset * (top ? 1 : -1)}px)`,
    ...verticalStyle,
    ...horizontalStyle,
  };
};

const activeClass = css`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;

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
  const scrollViewRef = React.useRef<HTMLDivElement>(null);
  // const MAX_TOAST_LIMIT = 20;
  // toasts.reduce((prev, curr) => prev + (curr.height ?? 0), 0) + MAX_TOAST_LIMIT * DEFAULT_OFFSET

  const totalHeight =
    toasts.reduce((prev, curr) => {
      return prev + (curr.height ?? 0);
    }, 0) +
    toasts.length * DEFAULT_OFFSET;

  React.useLayoutEffect(() => {
    if (scrollViewRef.current && !isMouseOver) {
      scrollViewRef.current.scrollTo({
        top: totalHeight,
      });
    }
  }, [isMouseOver, toasts.length, totalHeight]);

  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 9999,
        top: DEFAULT_OFFSET,
        left: DEFAULT_OFFSET,
        right: DEFAULT_OFFSET,
        bottom: DEFAULT_OFFSET,
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
          position: 'absolute',
          bottom: '0%',
          width: '360px',
          maxHeight: '300px',
          overflow: 'scroll',
          pointerEvents: 'auto',
        }}
        ref={scrollViewRef}
      >
        <div
          style={{
            position: 'relative',
            width: 'auto',
            top: '0%',
            height: totalHeight,
          }}
        >
          {toasts.map((t) => {
            const toastPosition = t.position ?? position;
            const offset = handlers.calculateOffset(t, {
              reverseOrder,
              gutter,
              defaultPosition: position,
            });
            const positionStyle = getPositionStyle(toastPosition, offset);

            return (
              <ToastWrapper
                id={t.id}
                key={t.id}
                onHeightUpdate={handlers.updateHeight}
                className={t.visible ? ((activeClass as unknown) as string) : ''}
                style={positionStyle}
              >
                {resolveValue(t.message, t)}
              </ToastWrapper>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ToastContainer = ({ position = 'bottom-left' }: ToastContainerProps): React.ReactElement => {
  return <MyToaster position={position} />;
};

export { ToastContainer };
