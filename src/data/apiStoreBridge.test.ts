import createBridge, {
  CREATE_SELECTOR,
  set,
} from "./apiStoreBridge";
import {
  AVAILABLE,
  LOADING,
  NOT_REQUESTED,
} from "./result";
test("selector returns not requested for query by id", () => {
  expect(
    createBridge({
      entityName: "test",
    }).createSelectResult({ id: 1 })({
      data: {},
    })
  ).toBe(NOT_REQUESTED);
});
test("selector returns available result from path query by id", () => {
  const ITEM = {};
  expect(
    createBridge({
      entityName: "test",
      path: ["a", "b"],
    }).createSelectResult({
      id: 1,
    })({
      a: {
        b: {
          data: { "1": ITEM },
        },
      },
    })
  ).toBe(ITEM);
});
test("selector returns not requested for query page", () => {
  expect(
    createBridge({ entityName: "test" }).createSelectResult(
      {}
    )({ queries: {} })
  ).toBe(NOT_REQUESTED);
});
test("selector returns for query page", () => {
  const state: any = {
    queries: {
      "{}": [1, 2],
    },
    data: {
      "1": { ...AVAILABLE, value: "a" },
    },
  };
  expect(
    createBridge({ entityName: "test" }).createSelectResult(
      {}
    )(state)
  ).toBe(NOT_REQUESTED);
  state.data["2"] = { ...AVAILABLE, value: "b" };
  expect(
    createBridge({ entityName: "test" }).createSelectResult(
      {}
    )(state)
  ).toEqual({ ...AVAILABLE, value: ["a", "b"] });
});
test("selector can override", () => {
  const query = { id: 1 };
  const state: any = {
    data: {
      1: 88,
    },
  };
  const config = {
    entityName: "test",
    override: (_type: any, cb: any) => (...args: any[]) =>
      cb(...args),
  };
  expect(
    createBridge(config).createSelectResult(query)(state)
  ).toBe(88);
  config.override = (type) => (query: any) => (
    state: any
  ) =>
    type === CREATE_SELECTOR ? [query, state, 88] : "nope";
  expect(
    createBridge(config).createSelectResult(query)(state)
  ).toEqual([query, state, 88]);
});
test("returns action types", () => {
  const {
    actionTypes: { REQUESTED, SUCCEEDED, FAILED },
  } = createBridge({ entityName: "test" });
  expect(REQUESTED).toBe("TEST_REQUESTED");
  expect(SUCCEEDED).toBe("TEST_SUCCEEDED");
  expect(FAILED).toBe("TEST_FAILED");
});
test("action creator creates correct action", () => {
  const {
    actions: { requested, succeeded, failed },
    actionTypes: { REQUESTED, SUCCEEDED, FAILED },
  } = createBridge({ entityName: "test" });
  const arg = { hello: "world" };
  const query = { query: "here" };
  expect(requested(query)).toEqual({
    type: REQUESTED,
    payload: { query },
  });
  expect(succeeded(query, arg)).toEqual({
    type: SUCCEEDED,
    payload: { query, data: arg },
  });
  expect(failed(query, arg)).toEqual({
    type: FAILED,
    payload: { query, error: arg },
  });
});
test("set works setting deeply nested state value", () => {
  expect(
    set(
      ["one", "two"],
      { one: { two: 88, other: 88 }, other: 88 },
      (n: number) => n + 2
    )
  ).toEqual({ one: { two: 90, other: 88 }, other: 88 });
});
test("reducer with query containing id", () => {
  const path = ["test"];
  const {
    reducer,
    actions: { requested, succeeded, failed },
  } = createBridge({ entityName: "test", path });
  const state = { test: { data: {}, queries: {} } };
  const itemRequested = reducer(
    state,
    requested({ id: 88 })
  );
  expect(itemRequested).toEqual({
    ...state,
    test: { ...state.test, data: { 88: LOADING } },
  });
  const itemFailed = reducer(
    state,
    failed({ id: 88 }, "error")
  );
  expect(itemFailed).toEqual({
    ...state,
    test: {
      ...state.test,
      data: { 88: { ...AVAILABLE, error: "error" } },
    },
  });
  const itemSucceeded = reducer(
    state,
    succeeded({ id: 88 }, "entity")
  );
  expect(itemSucceeded).toEqual({
    ...state,
    test: {
      ...state.test,
      data: { 88: { ...AVAILABLE, value: "entity" } },
    },
  });
});
