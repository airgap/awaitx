import { DependencyList, ReactNode } from "react";
import { useFuture } from "use-future";

/**
 * Await component for handling asynchronous data loading and rendering.
 *
 * @param source - A function that returns a promise of type T.
 * @param dependencies - An optional array of dependencies for the useFuture hook.
 * @param then - A render function that receives the resolved value of type T and returns a ReactNode.
 * @param fail - A render function that receives the error value and returns a ReactNode.
 * @param meanwhile - A ReactNode to render while the promise is pending.
 * @param catchall - A catch-all render function that receives the resolved value, error, and loading state, and returns a ReactNode.
 * @returns A ReactNode based on the state of the promise and the provided render functions.
 */
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
  // Use the useFuture hook to manage the asynchronous state
  const [yes, no, loading] = useFuture(source, dependencies);

  // Render logic based on the state of the promise and the provided render functions
  return loading && meanwhile
    ? meanwhile // Render 'meanwhile' if the promise is pending and 'meanwhile' is provided
    : yes && then
      ? then(yes) // Render the 'then' function with the resolved value if available
      : no && fail
        ? fail(no) // Render the 'fail' function with the error value if available
        : catchall?.(yes, no, loading); // Render the 'catchall' function (if provided) with the resolved value, error, and loading state
};
