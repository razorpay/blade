import styled from 'styled-components';
import type { CollapsibleProps } from './Collapsible';
import { useCollapsible } from './CollapsibleContext';
import {
  getCollapsibleChevronIconTransforms,
  getTransitionDuration,
  getTransitionEasing,
} from './commonStyles';
import { castWebType, makeAccessible } from '~utils';
import type { IconComponent } from '~components/Icons';
import { ChevronDownIcon } from '~components/Icons';
import BaseBox from '~components/Box/BaseBox';

type StyledCollapsibleChevronIconProps = {
  isExpanded: boolean;
  direction: CollapsibleProps['direction'];
};

const StyledCollapsibleChevronIcon = styled(BaseBox)<StyledCollapsibleChevronIconProps>((props) => {
  const { isExpanded, direction, theme } = props;

  const { transformExpanded, transformCollapsed } = getCollapsibleChevronIconTransforms({
    direction,
  });
  const transitionDuration = castWebType(getTransitionDuration(theme));
  const transitionTimingFunction = castWebType(getTransitionEasing(theme));

  return {
    display: 'flex',
    alignItems: 'center',
    transform: isExpanded ? `rotate(${transformExpanded}deg)` : `rotate(${transformCollapsed}deg)`,
    transformOrigin: 'center center',
    transitionDuration,
    transitionTimingFunction,
    transitionProperty: 'transform',
  };
});

// Not really an IconComponent, a wrapper is needed for animating the icon inside
const CollapsibleChevronIcon: IconComponent = (props) => {
  const { isExpanded, direction } = useCollapsible();
  return (
    <StyledCollapsibleChevronIcon
      isExpanded={isExpanded}
      direction={direction}
      {...makeAccessible({ hidden: true })}
    >
      <ChevronDownIcon {...props} />
    </StyledCollapsibleChevronIcon>
  );
};

export { CollapsibleChevronIcon };
