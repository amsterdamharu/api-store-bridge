function getValue<T>(result: Result<T>) {
  return result.value;
}
export const LOADING = {
  loading: true,
  requested: true,
  reloading: false,
  error: null,
  value: null,
};
export const AVAILABLE = {
  ...LOADING,
  loading: false,
};
export const NOT_REQUESTED = {
  ...LOADING,
  loading: false,
  requested: false,
};
export type Result<T> = {
  loading: boolean;
  requested: boolean;
  reloading: boolean;
  error: any;
  value: T;
};
export const isResult = (val: any = {}) =>
  ["loading", "requested", "reloading", "error"].reduce(
    (result, key) => result && val.hasOwnProperty(key),
    true
  );
export function asResult<T>(
  value: T | Result<T>
): Result<T> {
  return isResult(value)
    ? (value as Result<T>)
    : ({ ...AVAILABLE, value } as Result<T>);
}
export const isAvailable = (value: Result<any>) =>
  !value.loading &&
  value.requested &&
  !Boolean(value.error);
export const pickUnavailableResult = (
  results: Result<any>[],
  priority = [
    (result: Result<any>) => Boolean(result.error),
    (result: Result<any>) => !result.requested,
    (result: Result<any>) => result.loading,
  ]
) => {
  const recur = (
    results: Result<any>[],
    finder: ((result: Result<any>) => boolean)[]
  ): Result<any> | null => {
    if (finder.length === 0) {
      return null;
    }
    const result = results.find(finder[0]);
    if (result) {
      return result;
    }
    return recur(results, finder.slice(1));
  };
  return recur(results, priority);
};
export const mapResults = (...results: any[]) => (
  fn: any
): Result<any> => {
  const forcedResults = (results as any[]).map(asResult);
  const notAvailable = pickUnavailableResult(forcedResults);
  if (notAvailable) {
    return notAvailable;
  }
  return asResult(fn(...forcedResults.map(getValue)));
};
export const promiseResults = (
  ...results: Result<any>[] | any[]
) => {
  const forcedResults = (results as any[]).map(asResult);
  const notAvailable = pickUnavailableResult(
    forcedResults.map(asResult)
  );
  if (notAvailable) {
    return Promise.reject(notAvailable);
  }
  return Promise.resolve(forcedResults.map(getValue));
};
