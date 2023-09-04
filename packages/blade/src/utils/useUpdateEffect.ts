import React from 'react';

/**
 * This hooks is used to run an effect only when the component is updated, not on the first render.
 * Simulates componentDidUpdate.
 *
 * @param effect callback to run when the component is updated
 * @param deps dependencies to watch for changes
 */
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
