import styled from 'styled-components';
import { useTooltipContext } from './TooltipContext';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

const TooltipInteractiveWrapper = styled(BaseBox).attrs(() => {
  return {
    tabIndex: -1,
    ...metaAttribute({
      testID: 'tooltip-interactive-wrapper',
      name: MetaConstants.TooltipInteractiveWrapper,
    }),
  };
})(() => {
  useTooltipContext();

  return {
    display: 'inline-block',
  };
});

export { TooltipInteractiveWrapper };
