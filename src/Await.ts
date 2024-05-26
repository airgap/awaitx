import { DependencyList, ReactNode } from "react";
import { useFuture } from "use-future";

export const Await = <T>({
  source,
  dependencies,
  then,
  fail,
  meanwhile,
  catchall,
}: {
  source: () => Promise<T>;
  dependencies?: DependencyList;
  then?: (value: T) => ReactNode;
  fail?: (error: unknown) => ReactNode;
  meanwhile?: ReactNode;
  catchall?: (value?: T, error?: unknown, loading?: boolean) => ReactNode;
}): ReactNode => {
  const [yes, no, loading] = useFuture(source, dependencies);
  return loading && meanwhile
    ? meanwhile
    : yes && then
      ? then(yes)
      : no && fail
        ? fail(no)
        : catchall?.(yes, no, loading);
};
