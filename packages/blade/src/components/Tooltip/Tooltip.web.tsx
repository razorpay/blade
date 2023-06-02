/* eslint-disable @typescript-eslint/restrict-plus-operands */
import {
  arrow,
  flip,
  FloatingArrow,
  offset,
  shift,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  useTransitionStyles,
} from '@floating-ui/react';
import React from 'react';
import styled from 'styled-components';
import { TooltipProps } from './types';
import { TooltipContent } from './TooltipContentWrapper';
import { ARROW_HEIGHT, ARROW_WIDTH } from './constants';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { makeAccessible, makeBorderSize } from '~utils';

const TooltipInteractiveWrapper = styled.span(({ theme }) => {
  return {
    '&:focus': {
      borderRadius: makeBorderSize(theme.border.radius.medium),
      // TODO: Replace with focus outline token
      outline: `1px solid ${theme.colors.surface.background.level1.lowContrast}`,
      boxShadow: `0px 0px 0px 4px ${theme.colors.brand.primary[400]}`,
    },
  };
});

const Tooltip = ({
  content,
  children,
  placement,
  shouldWrapChildren,
  onOpen,
  onClose,
}: TooltipProps): React.ReactElement => {
  const { theme } = useTheme();
  const GAP = theme.spacing[2];
  const [isOpen, setIsOpen] = React.useState(false);
  const arrowRef = React.useRef<SVGSVGElement>(null);
  const { refs, floatingStyles, context } = useFloating({
    placement,
    open: isOpen,
    onOpenChange: (open) => {
      if (open) {
        setIsOpen(true);
        onOpen?.();
      } else {
        setIsOpen(false);
        onClose?.();
      }
    },
    middleware: [
      flip({ crossAxis: false }),
      shift({ padding: GAP }),
      offset(GAP + ARROW_HEIGHT),
      arrow({ element: arrowRef }),
    ],
  });
  const { isMounted, styles } = useTransitionStyles(context, {
    duration: theme.motion.duration.xquick,
    initial: {
      opacity: 0,
    },
  });

  const hover = useHover(context, {
    delay: {
      open: 400,
      close: 1000,
    },
  });

  const focus = useFocus(context);
  const role = useRole(context, { role: 'tooltip' });
  const { getReferenceProps, getFloatingProps } = useInteractions([role, hover, focus]);

  return (
    <>
      {shouldWrapChildren ? (
        <TooltipInteractiveWrapper
          tabIndex={0}
          ref={refs.setReference}
          {...makeAccessible({ label: content })}
          {...getReferenceProps()}
        >
          {children}
        </TooltipInteractiveWrapper>
      ) : (
        React.cloneElement(children, { ref: refs.setReference, ...getReferenceProps() })
      )}
      {isMounted && (
        <BaseBox ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
          <TooltipContent
            style={styles}
            arrow={
              <FloatingArrow
                ref={arrowRef}
                context={context}
                width={ARROW_WIDTH}
                height={ARROW_HEIGHT}
                fill={theme.colors.brand.gray[200].highContrast}
                stroke={theme.colors.brand.gray[300].highContrast}
                strokeWidth={theme.border.width.thin}
                // push the arrow a bit downwards to the border cutoff doesn't show up
                style={{ marginBottom: -1.5 }}
              />
            }
          >
            {content}
          </TooltipContent>
        </BaseBox>
      )}
    </>
  );
};

export { Tooltip, TooltipProps };
