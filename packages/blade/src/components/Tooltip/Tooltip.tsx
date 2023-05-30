import { useFloating, useFocus, useHover, useInteractions } from '@floating-ui/react';
import React from 'react';

type TooltipProps = {
  content: string;
  children: React.ReactNode;
};

const Tooltip = ({ content, children }: TooltipProps): React.ReactElement => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });

  const hover = useHover(context);
  const focus = useFocus(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus]);

  return (
    <>
      {React.cloneElement(children, { ref: refs.setReference, ...getReferenceProps() })}
      {isOpen && (
        <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
          Tooltip
        </div>
      )}
    </>
  );
};

export { Tooltip, TooltipProps };
