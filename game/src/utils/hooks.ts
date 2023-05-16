import { createRef, RefObject } from "react";

export const useMultipleRefs = <T extends HTMLInputElement>(
  length: number
): RefObject<T>[] => {
  const refs = Array(length)
    .fill(null)
    .map(() => createRef<T>());
  return refs;
};
