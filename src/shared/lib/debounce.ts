export function debounce<T extends (...args: any[]) => any>(
  func: T,
  ms: number
) {
  let timeout: number | undefined;
  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), ms);
  };
}
