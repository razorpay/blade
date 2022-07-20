/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from 'react';
import './styles.css';

type FadeProps = {
  show?: boolean;
  children: React.ReactNode;
  enter: string;
  leave: string;
  styles?: React.CSSProperties;
};

const Fade = ({ show, children, enter, leave, styles }: FadeProps) => {
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
