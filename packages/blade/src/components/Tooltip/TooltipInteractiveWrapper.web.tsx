import React from 'react';
import { useTooltipContext } from './TooltipContext';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

const TooltipInteractiveWrapper = React.forwardRef<HTMLDivElement, Omit<BaseBoxProps, 'as'>>(
  (props, ref) => {
    useTooltipContext();

    return (
      <BaseBox
        ref={ref}
        tabIndex={-1}
        display="inline-block"
        {...metaAttribute({
          testID: 'tooltip-interactive-wrapper',
          name: MetaConstants.TooltipInteractiveWrapper,
        })}
        {...props}
      />
    );
  },
);

export { TooltipInteractiveWrapper };
