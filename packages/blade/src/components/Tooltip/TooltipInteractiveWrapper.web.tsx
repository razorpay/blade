import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute, MetaConstants } from '~utils';

const TooltipInteractiveWrapper = styled(BaseBox).attrs(() => {
  return {
    tabIndex: -1,
    ...metaAttribute({
      testID: 'tooltip-interactive-wrapper',
      name: MetaConstants.TooltipInteractiveWrapper,
    }),
  };
})(() => {
  return {
    display: 'inline-block',
  };
});

export { TooltipInteractiveWrapper };
