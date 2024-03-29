import { createRef } from "react";

import type { RefObject } from "react";

/**
 * Creates an array of RefObjects for the specified length.
 *
 * @template T - The type of HTMLInputElement the RefObject will reference.
 * @param {number} length - The number of RefObjects to create.
 * @returns {RefObject<T>[]} - An array of RefObjects of the specified length.
 */
export const useMultipleRefs = <T extends HTMLInputElement>(
  length: number,
): RefObject<T>[] => {
  const refs = Array(length)
    .fill(null)
    .map(() => createRef<T>());
  return refs;
};
