function getValue<T>(result: Result<T>) {
  return result.resolved;
}
export const PENDING = {
  pending: true, //async is pending
  created: true, //async is created
  rejected: null,
  resolved: null,
};
export const FULFILLED = {
  ...PENDING,
  pending: false,
};
export const NOT_CREATED = {
  ...PENDING,
  pending: false,
  created: false,
};
export type Result<T> = {
  pending: boolean;
  created: boolean;
  rejected: any;
  resolved: T;
};
export const isResult = (val: any = {}) =>
  ['pending', 'created', 'rejected'].reduce(
    (result, key) => result && val.hasOwnProperty(key),
    true
  );
export function asResult<T>(
  value: T | Result<T>
): Result<T> {
  return isResult(value)
    ? (value as Result<T>)
    : ({ ...FULFILLED, resolved: value } as Result<T>);
}
export const isAvailable = (value: Result<any>) =>
  !value.pending &&
  value.created &&
  !Boolean(value.rejected);
export const pickUnavailableResult = (
  results: Result<any>[],
  priority = [
    (result: Result<any>) => Boolean(result.rejected),
    (result: Result<any>) => !result.created,
    (result: Result<any>) => result.pending,
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
export const isRequested = (result: Result<any>) =>
  ((result.pending && result.created) || //is requested
    isAvailable(result)) && //is available
  !Boolean(result.rejected); //has been rejected (re create)
