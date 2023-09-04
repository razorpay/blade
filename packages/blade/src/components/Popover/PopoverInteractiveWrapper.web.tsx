import styled from 'styled-components';
import { usePopoverContext } from './PopoverContext';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

const PopoverInteractiveWrapper = styled(BaseBox).attrs((props) => {
  return {
    tabIndex: props.tabIndex ?? -1,
    ...metaAttribute({
      testID: 'popover-interactive-wrapper',
      name: MetaConstants.PopoverInteractiveWrapper,
    }),
  };
})((props) => {
  usePopoverContext();

  return {
    // TODO:
    display: props.display ?? 'inline-block',
  };
});

export { PopoverInteractiveWrapper };
