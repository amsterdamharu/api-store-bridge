import {
  isResult,
  asResult,
  isAvailable,
  mapResults,
  pickUnavailableResult,
  promiseResults,
  LOADING,
  AVAILABLE,
  NOT_REQUESTED,
} from "./result";
const ERROR = { ...AVAILABLE, error: true };
test("is result", () => {
  expect(isResult(22)).toBe(false);
  expect(isResult(LOADING)).toBe(true);
});
test("as result", () => {
  expect(asResult(22)).toEqual({ ...AVAILABLE, value: 22 });
  expect(LOADING).toBe(LOADING);
  expect(AVAILABLE).toBe(AVAILABLE);
});
test("is available", () => {
  expect(isAvailable(LOADING)).toBe(false);
  expect(isAvailable(AVAILABLE)).toBe(true);
  expect(isAvailable(ERROR)).toBe(false);
});
test("pick unavailable", () => {
  //pick most important unavailable result
  // in order of priority: error, not requested, loading
  expect(
    pickUnavailableResult([ERROR, NOT_REQUESTED])
  ).toBe(ERROR);
  expect(
    pickUnavailableResult([NOT_REQUESTED, LOADING])
  ).toBe(NOT_REQUESTED);
  expect(pickUnavailableResult([LOADING, AVAILABLE])).toBe(
    LOADING
  );
  //return null if all results are available
  expect(pickUnavailableResult([AVAILABLE])).toBe(null);
  //provide your own priority
  expect(
    pickUnavailableResult(
      [LOADING, ERROR, AVAILABLE],
      [(r) => r.loading]
    )
  ).toBe(LOADING);
  expect(
    pickUnavailableResult(
      [LOADING, ERROR, NOT_REQUESTED],
      []
    )
  ).toBe(null);
});
test("map result", () => {
  const callback = jest.fn();
  mapResults(asResult(22))(callback);
  expect(callback).toHaveBeenCalledWith(22);
  expect(
    mapResults(
      asResult(1),
      asResult(2)
    )((a: number, b: number) => a + b)
  ).toEqual({
    ...AVAILABLE,
    value: 3,
  });
  [LOADING, ERROR, NOT_REQUESTED].forEach((result) =>
    mapResults(result)(() => {
      throw new Error("should not have been called");
    })
  );
  //should be able to call mapResult with non result values
  expect(
    mapResults(1, 4)((a: number, b: number) => a + b)
  ).toEqual({
    ...AVAILABLE,
    value: 5,
  });
});
test("result promise", () => {
  // eslint-disable-next-line jest/valid-expect-in-promise
  const p1 = promiseResults(AVAILABLE, ERROR).then(
    () => {
      expect("Should not resolve").toBe(88);
    },
    (rejectWith) => {
      expect(rejectWith).toBe(ERROR);
    }
  );
  // eslint-disable-next-line jest/valid-expect-in-promise
  const p2 = promiseResults(
    ...[1, 2, 3].map(asResult)
  ).then((args) => {
    expect(args).toEqual([1, 2, 3]);
  });
  // eslint-disable-next-line jest/valid-expect-in-promise
  const p3 = promiseResults(
    ...[1, 2, 5] //promise result can have normal values as well
  ).then((args) => {
    expect(args).toEqual([1, 2, 5]);
  });
  return Promise.all([p1, p2, p3]).catch(() => {
    expect("should not reject").toBe(88);
  });
});
