import React from 'react';

import BaseBox from '~components/Box/BaseBox';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

import { useTooltipContext } from './TooltipContext';

import type { BaseBoxProps } from '~components/Box/BaseBox';

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
