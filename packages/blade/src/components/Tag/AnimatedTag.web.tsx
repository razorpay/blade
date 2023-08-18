import React from 'react';
import styled, { css, FlattenSimpleInterpolation, keyframes } from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { makeMotionTime, useTheme } from '~utils';
import { Tag } from './Tag';
import { AnimatedTagProps } from './types';

const tagDissappearKeyframe = keyframes`
  100% {
    opacity: 1;
    max-width: 140px;
  }

  100% {
    opacity: 0;
    max-width: 0px;
    max-height: 0px;
  }
`;

const tagShowKeyframe = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`;

const AnimatedTagContainer = styled(BaseBox)<{
  transition: FlattenSimpleInterpolation;
}>(
  (props) => css`
    ${props.transition};
    display: inline-block;
    max-width: 140px;
  `,
);

const AnimatedTag = ({
  children,
  currentTagIndex,
  activeTagIndex,
  onDismiss,
  tagsLength,
}: AnimatedTagProps) => {
  const [isTagVisible, setIsTagVisible] = React.useState(true);
  const { theme } = useTheme();
  const prevSelectionsLength = React.useRef<number>();

  const hideTagTransition = css`
    animation: ${tagDissappearKeyframe} ${makeMotionTime(theme.motion.duration.xquick)}
      ${String(theme.motion.easing.exit.effective)};
  `;

  const showTagTransition = css`
    animation: ${tagShowKeyframe} ${makeMotionTime(theme.motion.duration.xquick)}
      ${String(theme.motion.easing.entrance.effective)};
  `;

  const noTransition = css`
    animation: none;
  `;

  const isTagRemoved = prevSelectionsLength.current
    ? prevSelectionsLength.current > tagsLength
    : false;

  return (
    <AnimatedTagContainer
      style={{ opacity: isTagVisible ? 1 : 0 }}
      onAnimationEnd={() => {
        if (!isTagVisible) {
          setIsTagVisible(true);
          onDismiss({ tagIndex: currentTagIndex, tagName: children });
        }
      }}
      transition={
        isTagRemoved ? noTransition : isTagVisible ? showTagTransition : hideTagTransition
      }
    >
      <Tag
        _isVirtuallyFocussed={currentTagIndex === activeTagIndex}
        _isTagInsideInput={true}
        onDismiss={() => {
          prevSelectionsLength.current = tagsLength;
          setIsTagVisible(false);
        }}
        marginRight="spacing.3"
        marginY="spacing.2"
      >
        {children}
      </Tag>
    </AnimatedTagContainer>
  );
};

export { AnimatedTag };
