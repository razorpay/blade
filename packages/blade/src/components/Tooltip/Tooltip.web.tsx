/* eslint-disable @typescript-eslint/restrict-plus-operands */
import {
  arrow,
  flip,
  FloatingArrow,
  offset,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  useTransitionStyles,
} from '@floating-ui/react';
import React from 'react';
import styled from 'styled-components';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { castWebType, makeAccessible, makeBorderSize } from '~utils';

type TooltipProps = {
  content: string;
  children: React.ReactElement;
  shouldWrapChildren?: boolean;
};

const TooltipContentWrapper = styled(BaseBox)(({ theme }) => {
  return {
    backgroundColor: theme.colors.brand.gray[200].highContrast,
    borderWidth: makeBorderSize(theme.border.width.thin),
    borderRadius: makeBorderSize(theme.border.radius.medium),
    borderColor: theme.colors.brand.gray[300].highContrast,
    borderStyle: 'solid',
    boxShadow: castWebType(theme.elevation.lowRaised),
  };
});

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

type TooltipContentProps = {
  children: React.ReactNode;
  style: React.CSSProperties;
};
const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ children, style }, ref) => {
    return (
      <TooltipContentWrapper
        paddingTop="spacing.3"
        paddingBottom="spacing.3"
        paddingLeft="spacing.4"
        paddingRight="spacing.4"
        ref={ref}
        style={style}
      >
        <Text
          variant="body"
          size="small"
          weight="regular"
          contrast="high"
          color="feedback.text.neutral.highContrast"
        >
          {children}
        </Text>
      </TooltipContentWrapper>
    );
  },
);

const ARROW_WIDTH = 14;
const ARROW_HEIGHT = 7;

const Tooltip = ({ content, children, shouldWrapChildren }: TooltipProps): React.ReactElement => {
  const { theme } = useTheme();
  const GAP = theme.spacing[2];
  const [isOpen, setIsOpen] = React.useState(false);
  const arrowRef = React.useRef<SVGSVGElement>(null);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(GAP + ARROW_HEIGHT),
      flip(),
      arrow({
        element: arrowRef,
      }),
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
          <TooltipContent style={styles}>
            {content}
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
          </TooltipContent>
        </BaseBox>
      )}
    </>
  );
};

export { Tooltip, TooltipProps };
