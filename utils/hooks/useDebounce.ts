/**
 * Debounce Hook
 * Debounces a value with a delay
 * Based on R14 performance optimization rules
 */

import { useState, useEffect } from "react";

/**
 * Debounce hook
 * Returns a debounced value that updates after the specified delay
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 400ms)
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

