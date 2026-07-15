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

  let result: number | undefined;
  switch (key) {
    case 'ArrowDown':
    case 'ArrowLeft':
      result = current - step;
      break;
    case 'ArrowRight':
    case 'ArrowUp':
      result = current + step;
      break;
    case 'End':
      result = inputMax;
      break;
    case 'Home':
      result = inputMin;
      break;
    case 'PageDown':
      result = current - pageStep;
      break;
    case 'PageUp':
      result = current + pageStep;
      break;
    default:
      return undefined;
  }

  return Math.min(Math.max(result, inputMin), inputMax);
};

export { getKeyboardValue, sliderKeyboardKeys };
