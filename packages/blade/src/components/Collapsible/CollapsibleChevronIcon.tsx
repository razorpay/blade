import styled from 'styled-components';
import type { CollapsibleProps } from './Collapsible';
import { useCollapsible } from './CollapsibleContext';
import { castWebType, makeAccessible, makeMotionTime } from '~utils';
import type { IconComponent } from '~components/Icons';
import { ChevronDownIcon } from '~components/Icons';
import BaseBox from '~components/Box/BaseBox';

type StyledCollapsibleChevronIconProps = {
  isExpanded: boolean;
  direction: CollapsibleProps['direction'];
};

// TODO: refactor common transition properties
const StyledCollapsibleChevronIcon = styled(BaseBox)<StyledCollapsibleChevronIconProps>((props) => {
  const { isExpanded, direction, theme } = props;
  let transformExpanded, transformCollapsed;
  if (direction === 'bottom') {
    transformExpanded = 'rotate(-0.5turn)';
    transformCollapsed = undefined;
  } else {
    transformExpanded = undefined;
    transformCollapsed = 'rotate(-0.5turn)';
  }

  return {
    display: 'flex',
    alignItems: 'center',
    transform: isExpanded ? transformExpanded : transformCollapsed,
    transformOrigin: 'center center',
    transitionDuration: castWebType(makeMotionTime(theme.motion.duration.xmoderate)),
    transitionTimingFunction: castWebType(theme.motion.easing.standard.effective),
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
