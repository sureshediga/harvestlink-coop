import { useLayoutEffect, useRef } from "react";

/**
 * After a step change, show the new step from the top without a smooth
 * scroll animation. useLayoutEffect runs before paint so the user does not
 * see the previous scroll position (bottom of the old step) flash, then
 * travel to the top.
 */
export function useScrollToTopOnChange(value: unknown) {
  const isFirstRender = useRef(true);
  const topRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    window.scrollTo(0, 0);
    topRef.current?.focus({ preventScroll: true });
  }, [value]);

  return topRef;
}
