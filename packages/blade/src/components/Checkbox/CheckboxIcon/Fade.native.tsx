/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from 'react';

type FadeProps = {
  children: React.ReactNode;
};

const Fade = ({ children }: FadeProps) => {
  return <>{children}</>;
};

export { Fade };
