/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from 'react';
import type { FadeProps } from './Fade.d';
import { useTheme } from '~components/BladeProvider';
import './styles.css';
import { makeMotionTime } from '~utils';

const Fade = ({ show, children, styles }: FadeProps) => {
  const { theme } = useTheme();

  const enter = `fadeIn ${makeMotionTime(theme.motion.duration.xquick)} ${
    theme.motion.easing.entrance.effective as string
  }`;

  const leave = `fadeOut ${makeMotionTime(theme.motion.duration.xquick)} ${
    theme.motion.easing.exit.effective as string
  }`;

  // if show is undefined do not initialize the animation to prevent flash of animation
  const animation =
    show !== undefined
      ? {
          animation: show ? `${enter}` : `${leave}`,
        }
      : {};

  return (
    <div
      style={{
        opacity: show ? 1 : 0,
        ...styles,
        ...animation,
      }}
    >
      {children}
    </div>
  );
};

export { Fade };
