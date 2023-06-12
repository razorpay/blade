import type { ReactElement } from 'react';
import { useCallback } from 'react';
import styled from 'styled-components';
import { useCollapsible } from './CollapsibleContext';
import type { CollapsibleProps } from './Collapsible';
import type { IconComponent } from '~components/Icons';
import { ChevronDownIcon } from '~components/Icons';
import type { LinkProps } from '~components/Link';
import { Link } from '~components/Link';
import { BaseBox } from '~components/Box/BaseBox';
import { castWebType, makeAccessible, makeMotionTime } from '~utils';

type CollapsibleLinkProps = Pick<
  LinkProps,
  'size' | 'isDisabled' | 'testID' | 'accessibilityLabel' | 'children'
>;

type StyledCollapsibleLinkIconProps = {
  isExpanded: boolean;
  direction: CollapsibleProps['direction'];
};

// TODO: refactor common transition properties
const StyledCollapsibleLinkIcon = styled(BaseBox)<StyledCollapsibleLinkIconProps>((props) => {
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
const CollapsibleLinkIcon: IconComponent = (props) => {
  const { isExpanded, direction } = useCollapsible();
  return (
    <StyledCollapsibleLinkIcon
      isExpanded={isExpanded}
      direction={direction}
      {...makeAccessible({ hidden: true })}
    >
      <ChevronDownIcon {...props} />
    </StyledCollapsibleLinkIcon>
  );
};

// TODO: update API doc, can't take icon
const CollapsibleLink = ({
  children,
  size,
  isDisabled,
  testID,
  accessibilityLabel,
}: CollapsibleLinkProps): ReactElement => {
  const { setIsExpanded } = useCollapsible();

  const toggleIsExpanded = useCallback(() => setIsExpanded((prevIsExpanded) => !prevIsExpanded), [
    setIsExpanded,
  ]);

  return (
    <Link
      variant="button"
      size={size}
      icon={CollapsibleLinkIcon}
      iconPosition="right"
      isDisabled={isDisabled}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      onClick={toggleIsExpanded}
    >
      {children}
    </Link>
  );
};

export { CollapsibleLink, CollapsibleLinkProps };
