// use why did you re render tells why a component re-rendered
import { useEffect, useRef } from 'react';

function useWhyDidYouRender(componentName: string, props: Record<string, any>): void {
  const previousProps = useRef(props);

  useEffect(() => {
    if (previousProps.current) {
      const changes: Record<string, { from: unknown; to: unknown }> = {};

      Object.keys(props).forEach((key) => {
        if (props[key] !== previousProps.current[key]) {
          changes[key] = {
            from: previousProps.current[key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changes).length > 0) {
        console.log(`[${componentName}] component re-rendered due to:`, changes);
      }
    }

    previousProps.current = props;
  }, [props, componentName]);
}

export default useWhyDidYouRender;
