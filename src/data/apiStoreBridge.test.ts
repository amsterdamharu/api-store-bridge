import createBridge, {
  CREATE_SELECTOR,
} from "./apiStoreBridge";
import { AVAILABLE, NOT_REQUESTED } from "./result";
test("selector returns not requested for query by id", () => {
  expect(
    createBridge().createSelectResult({ id: 1 })({
      data: {},
    })
  ).toBe(NOT_REQUESTED);
});
test("selector returns available result from path query by id", () => {
  const ITEM = {};
  expect(
    createBridge({ path: ["a", "b"] }).createSelectResult({
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
    createBridge().createSelectResult({})({ queries: {} })
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
  expect(createBridge().createSelectResult({})(state)).toBe(
    NOT_REQUESTED
  );
  state.data["2"] = { ...AVAILABLE, value: "b" };
  expect(
    createBridge().createSelectResult({})(state)
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
