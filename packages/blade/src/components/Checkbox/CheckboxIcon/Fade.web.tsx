/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useState, useEffect } from 'react';
import './styles.css';

type FadeProps = {
  show: boolean;
  children: React.ReactNode;
  onUnmount?: () => void;
  enter: string;
  leave: string;
  styles?: React.CSSProperties;
};

const Fade = ({ show, children, onUnmount, enter, leave, styles }: FadeProps) => {
  const [shouldRender, setRender] = useState(show);

  useEffect(() => {
    setRender(show);
  }, [show]);

  const animationEnd = () => {
    setRender(show);
    onUnmount?.();
  };

  return (
    <div
      style={{
        opacity: shouldRender ? 1 : 0,
        animation: show ? `${enter}` : `${leave}`,
        ...styles,
      }}
      onAnimationEnd={animationEnd}
    >
      {children}
    </div>
  );
};

export { Fade };
