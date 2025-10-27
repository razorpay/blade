// Debounce utility function for VSCode extensions
// Generic debounce function that works with any function signature

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean = false,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | undefined;

  return function executedFunction(...args: Parameters<T>): void {
    const later = () => {
      timeout = undefined;
      if (!immediate) func(...args);
    };

    const callNow = immediate && !timeout;

    if (timeout !== undefined) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);

    if (callNow) func(...args);
  };
};