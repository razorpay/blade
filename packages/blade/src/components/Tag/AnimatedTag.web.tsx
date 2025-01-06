import React from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import styled, { css, keyframes } from 'styled-components';
import { Tag } from './Tag';
import type { AnimatedTagProps } from './types';
import {
  TAG_MAX_WIDTH_END,
  TAG_MAX_WIDTH_START,
  TAG_OPACITY_END,
  TAG_OPACITY_START,
} from './tagAnimationConfig';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/BladeProvider';
import { makeMotionTime } from '~utils';

const tagDissappearKeyframe = keyframes`
  0% {
    opacity: ${TAG_OPACITY_START};
    max-width: ${TAG_MAX_WIDTH_START}
  }

  100% {
    opacity: ${TAG_OPACITY_END};
    max-width: ${TAG_MAX_WIDTH_END};
  }
`;

const tagShowKeyframe = keyframes`
  0% {
    opacity: ${TAG_OPACITY_END};
  }

  100% {
    opacity: ${TAG_OPACITY_START};
  }
`;

const AnimatedTagContainer = styled(BaseBox)<{
  transition: FlattenSimpleInterpolation;
  isVisible: boolean;
}>(
  (props) => css`
    ${props.transition};
    display: inline-block;
    opacity: ${props.isVisible ? TAG_OPACITY_START : TAG_OPACITY_END};
    max-width: ${props.isVisible ? TAG_MAX_WIDTH_START : TAG_MAX_WIDTH_END};
    flex-shrink: 0;
  `,
);

const AnimatedTag = ({
  children,
  currentTagIndex,
  isDisabled,
  activeTagIndex,
  onDismiss,
  size = 'medium',
}: AnimatedTagProps): React.ReactElement => {
  const [isTagVisible, setIsTagVisible] = React.useState(true);
  const { theme } = useTheme();

  const hideTagTransition = css`
    animation: ${tagDissappearKeyframe} ${makeMotionTime(theme.motion.duration.xquick)}
      ${String(theme.motion.easing.exit)};
  `;

  const showTagTransition = css`
    animation: ${tagShowKeyframe} ${makeMotionTime(theme.motion.duration.xquick)}
      ${String(theme.motion.easing.entrance)};
  `;

  return (
    <AnimatedTagContainer
      isVisible={isTagVisible}
      onAnimationEnd={() => {
        if (!isTagVisible) {
          onDismiss({ tagIndex: currentTagIndex, tagName: children });
        }
      }}
      transition={isTagVisible ? showTagTransition : hideTagTransition}
    >
      <Tag
        _isVirtuallyFocused={currentTagIndex === activeTagIndex}
        _isTagInsideInput={true}
        onDismiss={() => {
          setIsTagVisible(false);
        }}
        marginRight="spacing.3"
        marginY="spacing.2"
        isDisabled={isDisabled}
        size={size}
      >
        {children}
      </Tag>
    </AnimatedTagContainer>
  );
};

export { AnimatedTag };
