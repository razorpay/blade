import React from 'react';

const useFirstRender = (): boolean => {
  const isFirstRenderRef = React.useRef(true);

  React.useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
    }
  }, []);

  return isFirstRenderRef.current;
};

export { useFirstRender };
