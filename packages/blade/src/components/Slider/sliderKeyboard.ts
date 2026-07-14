const sliderKeyboardKeys = new Set([
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'End',
  'Home',
  'PageDown',
  'PageUp',
]);

type GetKeyboardValueArgs = {
  current: number;
  inputMax: number;
  inputMin: number;
  key: string;
  step: number;
};

const getKeyboardValue = ({
  current,
  inputMax,
  inputMin,
  key,
  step,
}: GetKeyboardValueArgs): number | undefined => {
  const pageStep = Math.max(step, (inputMax - inputMin) / 10);

  switch (key) {
    case 'ArrowDown':
    case 'ArrowLeft':
      return current - step;
    case 'ArrowRight':
    case 'ArrowUp':
      return current + step;
    case 'End':
      return inputMax;
    case 'Home':
      return inputMin;
    case 'PageDown':
      return current - pageStep;
    case 'PageUp':
      return current + pageStep;
    default:
      return undefined;
  }
};

export { getKeyboardValue, sliderKeyboardKeys };
