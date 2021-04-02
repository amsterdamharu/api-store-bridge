import {
  isResult,
  asResult,
  isAvailable,
  mapResults,
  pickUnavailableResult,
  promiseResults,
  PENDING,
  FULFILLED,
  NOT_CREATED,
  isRequested,
} from "./result";
const REJECTED = { ...FULFILLED, rejected: true };
test("is result", () => {
  expect(isResult(22)).toBe(false);
  expect(isResult(PENDING)).toBe(true);
});
test("as result", () => {
  expect(asResult(22)).toEqual({
    ...FULFILLED,
    resolved: 22,
  });
  expect(asResult(PENDING)).toBe(PENDING);
  expect(asResult(FULFILLED)).toBe(FULFILLED);
});
test("is available", () => {
  expect(isAvailable(PENDING)).toBe(false);
  expect(isAvailable(FULFILLED)).toBe(true);
  expect(isAvailable(REJECTED)).toBe(false);
  expect(isAvailable(NOT_CREATED)).toBe(false);
});
test("pick unavailable", () => {
  //pick most important unavailable result
  // in order of priority: rejected, not created, pending
  expect(
    pickUnavailableResult([REJECTED, NOT_CREATED])
  ).toBe(REJECTED);
  expect(
    pickUnavailableResult([NOT_CREATED, PENDING])
  ).toBe(NOT_CREATED);
  expect(pickUnavailableResult([PENDING, FULFILLED])).toBe(
    PENDING
  );
  //return null if all results are available
  expect(pickUnavailableResult([FULFILLED])).toBe(null);
  //provide your own priority
  expect(
    pickUnavailableResult(
      [PENDING, REJECTED, FULFILLED],
      [(r) => r.pending]
    )
  ).toBe(PENDING);
  expect(
    pickUnavailableResult(
      [PENDING, REJECTED, NOT_CREATED],
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
    ...FULFILLED,
    resolved: 3,
  });
  [PENDING, REJECTED, NOT_CREATED].forEach((result) =>
    mapResults(result)(() => {
      throw new Error("should not have been called");
    })
  );
  //should be able to call mapResult with non result values
  expect(
    mapResults(1, 4)((a: number, b: number) => a + b)
  ).toEqual({
    ...FULFILLED,
    resolved: 5,
  });
});
test("result promise", () => {
  // eslint-disable-next-line jest/valid-expect-in-promise
  const p1 = promiseResults(FULFILLED, REJECTED).then(
    () => {
      expect("Should not resolve").toBe(88);
    },
    (rejectWith) => {
      expect(rejectWith).toBe(REJECTED);
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
test("is result requested", () => {
  expect(isRequested(PENDING)).toBe(true);
  expect(isRequested(NOT_CREATED)).toBe(false);
  expect(
    isRequested({ ...FULFILLED, rejected: true })
  ).toBe(false);
  expect(isRequested(FULFILLED)).toBe(true);
});
