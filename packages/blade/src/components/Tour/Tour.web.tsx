/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { TourContext } from './TourContext';
import type { Rect } from './TourMask';
import { TourMask } from './TourMask';
import type { TourProps } from './types';

const Tour = ({
  steps,
  activeStep,
  isOpen,
  onFinish,
  onOpenChange,
  onStepChange,
  children,
}: TourProps): React.ReactElement => {
  const [refIdMap, setRefIdMap] = React.useState(new Map<string, React.RefObject<HTMLElement>>());
  const [_activeStep, setActiveStep] = React.useState(-1);
  const [size, setSize] = React.useState<Rect>({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  });

  const gotToNext = () => {
    setActiveStep((prev) => {
      if (prev === steps.length - 1) return prev;
      return prev + 1;
    });
  };

  const goToPrevious = () => {
    setActiveStep((prev) => {
      if (prev === 0) return prev;
      return prev - 1;
    });
  };

  const attachStep = React.useCallback((id: string, ref: React.RefObject<HTMLElement>) => {
    if (!ref) return;
    setRefIdMap((prev) => {
      return new Map(prev).set(id, ref);
    });
  }, []);

  const removeStep = React.useCallback((id: string) => {
    setRefIdMap((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  }, []);

  React.useLayoutEffect(() => {
    if (activeStep === -1) return;
    const ref = refIdMap.get(steps[activeStep]?.name);
    if (!ref) return;
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    setSize({
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    });
  }, [activeStep, refIdMap, steps]);

  const contextValue = React.useMemo(() => {
    return { attachStep, removeStep };
  }, [attachStep, removeStep]);

  return (
    <TourContext.Provider value={contextValue}>
      <TourMask padding={10} size={size} />

      {children}
    </TourContext.Provider>
  );
};

export { Tour };
