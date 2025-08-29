declare function throttle(func: (...args: any[]) => void, wait: number): (...args: any[]) => void;
export default throttle;
