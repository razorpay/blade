import React from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import styled, { css, keyframes } from 'styled-components';
import { Tag } from './Tag';
import type { AnimatedTagProps } from './types';
import {
  TAG_MAX_HEIGHT_END,
  TAG_MAX_WIDTH_END,
  TAG_MAX_WIDTH_START,
  TAG_OPACITY_END,
  TAG_OPACITY_START,
} from './tagAnimationConfig';
import BaseBox from '~components/Box/BaseBox';
import { makeMotionTime, makeSize, useTheme } from '~utils';

const tagDissappearKeyframe = keyframes`
  0% {
    opacity: ${TAG_OPACITY_START};
    max-width: ${makeSize(TAG_MAX_WIDTH_START)};
  }

  100% {
    opacity: ${TAG_OPACITY_END};
    max-width: ${makeSize(TAG_MAX_WIDTH_END)};
    max-height: ${makeSize(TAG_MAX_HEIGHT_END)};
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
}: AnimatedTagProps): React.ReactElement => {
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
