import { ReactNode } from "react";
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
  dependencies: unknown[];
  then?: (value: T) => ReactNode;
  fail?: (error: unknown) => ReactNode;
  meanwhile?: ReactNode;
  catchall?: (value?: T, error?: unknown, loading?: boolean) => ReactNode;
}): ReactNode => {
  const [yes, no, loading] = useFuture(source, dependencies);

  if (loading) {
    return meanwhile ?? catchall?.(undefined, undefined, true);
  }

  if (yes !== undefined) {
    return then ? then(yes) : catchall?.(yes, undefined, false);
  }

  if (no !== undefined) {
    return fail ? fail(no) : catchall?.(undefined, no, false);
  }

  return catchall?.(undefined, undefined, false);
};
