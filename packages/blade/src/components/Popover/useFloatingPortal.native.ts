import React from 'react';
import type { TouchableOpacity } from 'react-native';

type UseFloatingPortalReturn = {
  backdropRef: React.RefObject<TouchableOpacity>;
  backdropOffset: { x: number; y: number };
  onBackdropLayout: () => void;
};

const useFloatingPortal = (update: () => void, isVisible: boolean): UseFloatingPortalReturn => {
  const backdropRef = React.useRef<TouchableOpacity>(null);
  const [backdropOffset, setBackdropOffset] = React.useState({ x: 0, y: 0 });

  const onBackdropLayout = React.useCallback(() => {
    if (backdropRef.current && 'measureInWindow' in backdropRef.current) {
      ((backdropRef.current as unknown) as {
        measureInWindow: (cb: (x: number, y: number, w: number, h: number) => void) => void;
      }).measureInWindow((bx: number, by: number) => {
        setBackdropOffset({ x: bx || 0, y: by || 0 });
      });
    }
  }, []);

  // Re-run floating position computation after backdrop offset is measured
  React.useEffect(() => {
    if (isVisible && (backdropOffset.x !== 0 || backdropOffset.y !== 0)) {
      const id = setTimeout(() => {
        update();
      }, 50);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [backdropOffset, isVisible, update]);

  return { backdropRef, backdropOffset, onBackdropLayout };
};

export { useFloatingPortal };
