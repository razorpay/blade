/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
function throttle(func: (...args: any[]) => void, wait: number): (...args: any[]) => void {
  let isThrottled = false;
  let lastArgs: any[] | null = null;

  function wrapper(...args: any[]) {
    if (isThrottled) {
      lastArgs = args;
      return;
    }

    func(...args);
    isThrottled = true;

    setTimeout(() => {
      isThrottled = false;
      if (lastArgs) {
        wrapper(...lastArgs);
        lastArgs = null;
      }
    }, wait);
  }

  return wrapper;
}

export default throttle;

