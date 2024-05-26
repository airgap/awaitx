import { ReactNode } from "react";
import { useFuture } from "use-future";

export const Await = <T>({
  source,
  then,
  fail,
  meanwhile,
  catchall,
}: {
  source: () => Promise<T>;
  then?: (value: T) => ReactNode;
  fail?: (error: unknown) => ReactNode;
  meanwhile?: ReactNode;
  catchall?: (value?: T, error?: unknown, loading?: boolean) => ReactNode;
}): ReactNode => {
  const [yes, no, loading] = useFuture(source, [source]);
  return yes && then
    ? then(yes)
    : no && fail
      ? fail(no)
      : meanwhile ?? catchall?.(yes, no, loading);
};
