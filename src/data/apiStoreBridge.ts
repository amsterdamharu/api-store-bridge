//reducer for multiple entity query
//thunk action (external fetch)
//no container that passes props, you should make it yourself
// so it is not react specific

import {
  AVAILABLE,
  LOADING,
  mapResults,
  NOT_REQUESTED,
} from "./result";

//should have no react no redux, only reselect
interface Id {
  id: string | number;
}
interface Arg {
  getId?: (arg0: Id) => string | number;
  path?: string[];
  queryToString?: (arg0: object) => string;
  override?: (
    arg0: string,
    callback: any
  ) => (...args: any[]) => any;
  entityName: string;
}
const selectPath = (path: string[], state: any): any =>
  path.length === 0
    ? state
    : selectPath(path.slice(1), state[path[0]]);
export function set(
  path: string[],
  state: any,
  callback: any
): any {
  if (path.length === 1) {
    return {
      ...state,
      [path[0]]: callback(state[path[0]]),
    };
  }
  const current: any = state[path[0]];
  return {
    ...state,
    [path[0]]: {
      ...current,
      ...set(path.slice(1), current, callback),
    },
  };
}
export const CREATE_SELECTOR = "CREATE_SELECTOR";
export const REDUCER = "REDUCER";
const createBridge = ({
  entityName,
  getId = ({ id }: Id) => id,
  path = [],
  queryToString = (query) => JSON.stringify(query),
  override = (_type, callback) => (...args) =>
    callback(...args),
}: Arg) => {
  const createSelectResult = override(
    CREATE_SELECTOR,
    (query: any) => (state: any) => {
      if (getId(query)) {
        return (
          selectPath(path, state).data[getId(query)] ||
          NOT_REQUESTED
        );
      }
      return mapResults(
        selectPath(path, state).queries[
          queryToString(query)
        ] || NOT_REQUESTED
      )((ids: number[] | string[]) =>
        mapResults(
          ...ids.map(
            (id: any) => state.data[id] || NOT_REQUESTED
          )
        )((...items: any[]) => items)
      );
    }
  );
  const REQUESTED = `${entityName.toUpperCase()}_REQUESTED`;
  const SUCCEEDED = `${entityName.toUpperCase()}_SUCCEEDED`;
  const FAILED = `${entityName.toUpperCase()}_FAILED`;
  const reducer = override(
    REDUCER,
    (
      state: any,
      { type, payload }: { type: string; payload: any }
    ) => {
      const { query } = payload;
      const id = getId(query);
      if (type === REQUESTED && id) {
        return set(
          path.concat("data"),
          state,
          (data: any) => ({
            ...data,
            [id]: LOADING,
          })
        );
      }
      if (type === FAILED && id) {
        return set(
          path.concat("data"),
          state,
          (data: any) => ({
            ...data,
            [id]: { ...AVAILABLE, error: payload.error },
          })
        );
      }
      if (type === SUCCEEDED && id) {
        return set(
          path.concat("data"),
          state,
          (data: any) => ({
            ...data,
            [id]: { ...AVAILABLE, value: payload.data },
          })
        );
      }
      return state;
    }
  );
  return {
    createSelectResult,
    reducer,
    actionTypes: {
      REQUESTED,
      SUCCEEDED,
      FAILED,
    },
    actions: {
      requested: (query: any) => ({
        type: REQUESTED,
        payload: { query },
      }),
      succeeded: (query: any, data: any) => ({
        type: SUCCEEDED,
        payload: { query, data },
      }),
      failed: (query: any, error: any) => ({
        type: FAILED,
        payload: { query, error },
      }),
    },
  };
};
export default createBridge;
