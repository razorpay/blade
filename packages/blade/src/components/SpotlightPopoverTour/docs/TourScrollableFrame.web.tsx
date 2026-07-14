import React from 'react';

type TourScrollableFrameProps = {
  children: React.ReactNode;
};

/**
 * Web passthrough — the document/window already scrolls; tour uses scrollIntoView.
 */
const TourScrollableFrame = ({ children }: TourScrollableFrameProps): React.ReactElement => {
  return <>{children}</>;
};

export { TourScrollableFrame };
