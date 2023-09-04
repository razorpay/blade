import React from 'react';

const useUpdateEffect: typeof React.useEffect = (effect, deps) => {
  const isFirstMount = React.useRef(true);

  React.useEffect(() => {
    if (!isFirstMount.current) {
      effect();
    } else {
      isFirstMount.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export { useUpdateEffect };
