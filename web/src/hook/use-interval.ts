import { type DependencyList, useCallback, useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export default function useInterval<T extends Function>(
  timeout: number,
  callback: T,
  deps: DependencyList,
) {
  const fn = useCallback(callback, deps);
  useEffect(() => {
    fn();
    const interval = setInterval(fn, timeout);
    return () => clearInterval(interval);
  }, [fn, timeout]);
}
