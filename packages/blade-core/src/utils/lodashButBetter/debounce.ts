/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
function debounce(func: (...args: any[]) => void, wait: number): (...args: any[]) => void {
  let timeoutId: NodeJS.Timeout | null;

  function wrapper(...args: any[]) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, wait);
  }

  return wrapper;
}

export default debounce;

