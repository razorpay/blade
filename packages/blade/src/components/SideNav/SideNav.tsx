import React from 'react';
import styled from 'styled-components';
import { SideNavContext } from './SideNavContext';
import type { SideNavProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { size } from '~tokens/global';
import { makeMotionTime, makeSize } from '~utils';

const StyledL1Container = styled(BaseBox)((props) => {
  return {
    width: '100%',
    transition: `width ${makeMotionTime(props.theme.motion.duration.xmoderate)} ${
      props.theme.motion.easing.entrance.attentive
    }`,
    padding: '12px',
    '&.collapsed': {
      width: '52px',
      transition: `width ${makeMotionTime(props.theme.motion.duration.xmoderate)} ${
        props.theme.motion.easing.exit.attentive
      }`,
      padding: '12px 8px',
    },
  };
});

const SideNav = ({ children, routerLink: RouterLink }: SideNavProps): React.ReactElement => {
  const l2PortalContainerRef = React.useRef(null);
  const l1ContainerRef = React.useRef<HTMLDivElement>(null);
  const [isL1Collapsed, setIsL1Collapsed] = React.useState(false);
  const [isCollapsedHover, setIsCollapsedHover] = React.useState(false);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const onLinkActiveChange = (args) => {
    if (args.level === 1 && args.isL2Trigger && args.isActive) {
      setIsL1Collapsed(true);
      setIsCollapsedHover(false);
      setIsTransitioning(true);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    }

    if (args.level === 1 && !args.isL2Trigger && args.isActive) {
      setIsL1Collapsed(false);
    }
  };

  const contextValue = React.useMemo(
    () => ({ RouterLink, l2PortalContainerRef, onLinkActiveChange }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <SideNavContext.Provider value={contextValue}>
      <BaseBox
        position="fixed"
        backgroundColor="surface.background.gray.intense"
        height="100%"
        top="spacing.0"
        left="spacing.0"
        width={makeSize(size['256'])}
      >
        <BaseBox
          position="absolute"
          backgroundColor="surface.background.gray.intense"
          width="100%"
          ref={l2PortalContainerRef}
        />
        <StyledL1Container
          ref={l1ContainerRef}
          className={isL1Collapsed ? (isCollapsedHover ? '' : 'collapsed') : ''}
          position="absolute"
          backgroundColor="surface.background.gray.intense"
          height="100%"
          overflow="hidden"
          top="spacing.0"
          left="spacing.0"
          borderRightWidth="thin"
          borderRightColor="surface.border.gray.muted"
          onMouseOver={() => {
            if (isL1Collapsed && !isTransitioning) {
              setIsCollapsedHover(true);
            }
          }}
          onMouseOut={() => {
            if (isL1Collapsed) {
              setIsCollapsedHover(false);
            }
          }}
        >
          {children}
        </StyledL1Container>
      </BaseBox>
    </SideNavContext.Provider>
  );
};

export { SideNav };
