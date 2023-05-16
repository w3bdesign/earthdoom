import { createRef, useEffect, useState } from "react";

import type { RefObject } from "react";

interface UseLocalStorageResult<T> {
  value: T;
  setValue: (value: T | ((val: T) => T)) => void;
}

/**
 * Creates an array of RefObjects for the specified length.
 *
 * @template T - The type of HTMLInputElement the RefObject will reference.
 * @param {number} length - The number of RefObjects to create.
 * @returns {RefObject<T>[]} - An array of RefObjects of the specified length.
 */
export const useMultipleRefs = <T extends HTMLInputElement>(
  length: number
): RefObject<T>[] => {
  const refs = Array(length)
    .fill(null)
    .map(() => createRef<T>());
  return refs;
};

/**
 * A custom React hook that manages state with local storage.
 *
 * @template T - The type of the value to be stored in local storage.
 * @param {string} key - The key under which the value will be stored in local storage.
 * @param {T} initialValue - The initial value to be stored in local storage.
 * @returns {UseLocalStorageResult<T>} - An object containing the current value and a function to update the value.
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): UseLocalStorageResult<T> => {
  const [value, setValue] = useState<T>(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
      return JSON.parse(storedValue);
    }
    return initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return { value, setValue };
};
