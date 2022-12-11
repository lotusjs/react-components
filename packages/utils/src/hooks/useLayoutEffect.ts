import * as React from 'react';
import { isBrowser } from '@pansy/shared';

export const useLayoutEffect =
  process.env.NODE_ENV !== 'test' && isBrowser
    ? React.useLayoutEffect
    : React.useEffect;

export const useLayoutUpdateEffect: typeof React.useEffect = (
  callback,
  deps,
) => {
  const firstMountRef = React.useRef(true);

  useLayoutEffect(() => {
    if (!firstMountRef.current) {
      return callback();
    }
  }, deps);

  // We tell react that first mount has passed
  useLayoutEffect(() => {
    firstMountRef.current = false;
    return () => {
      firstMountRef.current = true;
    };
  }, []);
};
