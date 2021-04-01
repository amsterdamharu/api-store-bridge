import createBridge, { set } from "./apiStoreBridge";
import {
  AVAILABLE,
  LOADING,
  NOT_REQUESTED,
} from "./result";
const createFetchArgs = (x: any) => [x];
const defaultArg = {
  createFetchArgs,
  entityName: "test",
};
test("selector returns not requested for query by id", () => {
  expect(
    createBridge(defaultArg).createSelectResult({ id: 1 })({
      data: {},
    })
  ).toBe(NOT_REQUESTED);
});
test("selector returns available result from path query by id", () => {
  const ITEM = {};
  expect(
    createBridge({
      ...defaultArg,
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
  ).toEqual({ ...AVAILABLE, value: ITEM });
});
test("selector returns not requested for query page", () => {
  expect(
    createBridge(defaultArg).createSelectResult({})({
      queries: {},
    })
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
    createBridge(defaultArg).createSelectResult({})(state)
  ).toBe(NOT_REQUESTED);
  state.data["2"] = { ...AVAILABLE, value: "b" };
  expect(
    createBridge(defaultArg).createSelectResult({})(state)
  ).toEqual({ ...AVAILABLE, value: ["a", "b"] });
});
test("returns action types", () => {
  const {
    actions: {
      types: { REQUESTED, SUCCEEDED, FAILED },
    },
  } = createBridge(defaultArg);
  expect(REQUESTED).toBe("TEST_REQUESTED");
  expect(SUCCEEDED).toBe("TEST_SUCCEEDED");
  expect(FAILED).toBe("TEST_FAILED");
});
test("action creator creates correct action", () => {
  const {
    actions: {
      creators: { requested, succeeded, failed },
      types: { REQUESTED, SUCCEEDED, FAILED },
    },
  } = createBridge(defaultArg);
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
  expect(
    set([], { one: 88, two: 88 }, (o: any) => ({
      ...o,
      one: 90,
    }))
  ).toEqual({ one: 90, two: 88 });
});
test("reducer with query containing id", () => {
  const path = ["test"];
  const {
    reducer,
    actions: {
      creators: { requested, succeeded, failed },
    },
  } = createBridge({ ...defaultArg, path });
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
test("thunk should not dispatch when already requested", () => {
  const { thunk } = createBridge(defaultArg);
  const dispatch = jest.fn();
  const query = { id: 1 };
  const state: any = {
    data: { "1": { ...AVAILABLE, value: 88 } },
  };
  const getState = () => state;
  thunk(query)(dispatch, getState);
  expect(dispatch).not.toHaveBeenCalled();
  state.data["1"] = LOADING;
  thunk(query)(dispatch, getState);
  expect(dispatch).not.toHaveBeenCalled();
});
test("thunk should dispatch when not requested", async () => {
  const ITEM = { id: 1 };
  const resolve: any = { value: ITEM };
  const {
    thunk,
    actions: {
      creators: { requested, failed, succeeded },
    },
  } = createBridge({
    ...defaultArg,
    fetch: () => Promise.resolve(resolve.value),
  });
  const dispatch = jest.fn();
  const query = { id: 1 };
  const state: any = {
    data: {},
  };
  const getState = () => state;
  await thunk(query)(dispatch, getState);
  expect(dispatch.mock.calls).toEqual([
    [requested(query)],
    [succeeded(query, ITEM)],
  ]);
  dispatch.mockReset();
  resolve.value = Promise.reject("error");
  await thunk(query)(dispatch, getState);
  expect(dispatch.mock.calls).toEqual([
    [requested(query)],
    [failed(query, "error")],
  ]);
});
test.only("Passed in createFetchArgs is used by thunk", async () => {
  const ITEM = { id: 1 };
  const createFetchArgs = jest.fn();
  const { thunk } = createBridge({
    ...defaultArg,
    fetch: () => Promise.resolve(ITEM),
    createFetchArgs,
  });
  const dispatch = (x: any) => x;
  const query = { id: 1 };
  const state: any = {
    data: {},
  };
  const getState = () => state;
  createFetchArgs.mockReturnValue([1, 2]);
  await thunk(query)(dispatch, getState);
  expect(createFetchArgs.mock.calls).toEqual([[query]]);
});
