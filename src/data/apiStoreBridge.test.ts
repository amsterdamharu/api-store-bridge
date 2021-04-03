import createBridge, { set } from "./apiStoreBridge";
import { FULFILLED, PENDING, NOT_CREATED } from "./result";
const createFetchArgs = (x: any) => [x];
const defaultArg = {
  createFetchArgs,
  entityName: "test",
  getDataFromApiResult: () => 88,
  getMetaFromApiResult: () => 88,
};
test("selector returns not created for query by id", () => {
  expect(
    createBridge(defaultArg).createSelectResult({ id: 1 })({
      data: {},
    })
  ).toBe(NOT_CREATED);
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
  ).toEqual({ ...FULFILLED, resolved: ITEM });
});
test("selector returns not created for query page", () => {
  expect(
    createBridge(defaultArg).createSelectResult({})({
      queries: {},
    })
  ).toBe(NOT_CREATED);
});
test("selector returns for query page", () => {
  const state: any = {
    queries: {
      "{}": [1, 2],
    },
    data: {
      "1": { ...FULFILLED, resolved: "a" },
    },
  };
  expect(
    createBridge(defaultArg).createSelectResult({})(state)
  ).toBe(NOT_CREATED);
  state.data["2"] = { ...FULFILLED, resolved: "b" };
  expect(
    createBridge(defaultArg).createSelectResult({})(state)
  ).toEqual({ ...FULFILLED, resolved: ["a", "b"] });
});
test("returns action types", () => {
  const {
    actions: {
      types: { PENDING, FULFILLED, REJECTED },
    },
  } = createBridge(defaultArg);
  expect(PENDING).toBe("TEST_PENDING");
  expect(FULFILLED).toBe("TEST_FULFILLED");
  expect(REJECTED).toBe("TEST_REJECTED");
});
test("action creator creates correct action", () => {
  const {
    actions: {
      creators: { pending, fulfilled, rejected },
      types: { PENDING, FULFILLED, REJECTED },
    },
  } = createBridge(defaultArg);
  const arg = { hello: "world" };
  const query = { query: "here" };
  expect(pending(query)).toEqual({
    type: PENDING,
    payload: { query },
  });
  expect(fulfilled(query, arg)).toEqual({
    type: FULFILLED,
    payload: { query, data: arg },
  });
  expect(rejected(query, arg)).toEqual({
    type: REJECTED,
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
      creators: { pending, fulfilled, rejected },
    },
  } = createBridge({ ...defaultArg, path });
  const state = { test: { data: {}, queries: {} } };
  const itemPending = reducer(state, pending({ id: 88 }));
  expect(itemPending).toEqual({
    ...state,
    test: { ...state.test, data: { 88: PENDING } },
  });
  const itemRejected = reducer(
    state,
    rejected({ id: 88 }, "error")
  );
  expect(itemRejected).toEqual({
    ...state,
    test: {
      ...state.test,
      data: { 88: { ...FULFILLED, rejected: "error" } },
    },
  });
  const itemFulfilled = reducer(
    state,
    fulfilled({ id: 88 }, "entity")
  );
  expect(itemFulfilled).toEqual({
    ...state,
    test: {
      ...state.test,
      data: { 88: { ...FULFILLED, resolved: "entity" } },
    },
  });
});
test("thunk should not dispatch when already created", () => {
  const { thunk } = createBridge(defaultArg);
  const dispatch = jest.fn();
  const query = { id: 1 };
  const state: any = {
    data: { "1": { ...FULFILLED, resolved: 88 } },
  };
  const getState = () => state;
  thunk(query)(dispatch, getState);
  expect(dispatch).not.toHaveBeenCalled();
  state.data["1"] = PENDING;
  thunk(query)(dispatch, getState);
  expect(dispatch).not.toHaveBeenCalled();
});
test("thunk should dispatch when not created", async () => {
  const ITEM = { id: 1 };
  const resolve: any = { value: ITEM };
  const {
    thunk,
    actions: {
      creators: { pending, rejected, fulfilled },
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
    [pending(query)],
    [fulfilled(query, ITEM)],
  ]);
  dispatch.mockReset();
  resolve.value = Promise.reject("error");
  await thunk(query)(dispatch, getState);
  expect(dispatch.mock.calls).toEqual([
    [pending(query)],
    [rejected(query, "error")],
  ]);
});
test("Passed in createFetchArgs is used by thunk", async () => {
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
