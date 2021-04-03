//test page reducer for pending, succeeded and failed
//no container that passes props, you should make it yourself
// so it is not react specific
import {
  FULFILLED as FULFILLED_TYPE,
  isRequested,
  PENDING as PENDING_TYPE,
  mapResults,
  asResult,
  NOT_CREATED,
} from "./result";
const windowFetch = fetch;
//should have no react no redux
interface Id {
  id: string | number;
}
interface Arg {
  getId?: (arg0: Id) => string | number;
  path?: string[];
  queryToString?: (arg0: object) => string;
  entityName: string;
  fetch?: any;
  createFetchArgs: (arg0: object) => any[];
  getDataFromApiResult: (
    arg0: object,
    arg1: object
  ) => any[];
  getMetaFromApiResult: (arg0: object, arg1: object) => any;
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
  if (path.length === 0) {
    return callback(state);
  }
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
const createBridge = ({
  entityName,
  getId = ({ id }: Id) => id,
  path = [],
  queryToString = (query) => JSON.stringify(query),
  fetch = windowFetch,
  createFetchArgs,
  getDataFromApiResult,
  getMetaFromApiResult,
}: Arg) => {
  const createSelectResult = (query: any) => (
    state: any
  ) => {
    if (getId(query)) {
      return asResult(
        selectPath(path, state).data[getId(query)] ||
          NOT_CREATED
      );
    }
    return mapResults(
      selectPath(path, state).queries[
        queryToString(query)
      ] || NOT_CREATED
    )(
      ({
        ids,
        meta,
      }:
        | { ids: number[]; meta: any }
        | { ids: string[]; meta: any }) =>
        mapResults(
          ...[meta].concat(
            ids.map(
              (id: any) => state.data[id] || NOT_CREATED
            )
          )
        )((meta: any, ...items: any[]) => ({
          meta,
          items,
        }))
    );
  };
  const PENDING = `${entityName.toUpperCase()}_PENDING`;
  const FULFILLED = `${entityName.toUpperCase()}_FULFILLED`;
  const REJECTED = `${entityName.toUpperCase()}_REJECTED`;
  const reducer = (
    state: any,
    { type, payload }: { type: string; payload: any }
  ) => {
    const { query } = payload;
    const id = getId(query);
    if (type === PENDING && id) {
      return set(
        path.concat("data"),
        state,
        (data: any) => ({
          ...data,
          [id]: PENDING_TYPE,
        })
      );
    }
    if (type === REJECTED && id) {
      return set(
        path.concat("data"),
        state,
        (data: any) => ({
          ...data,
          [id]: {
            ...FULFILLED_TYPE,
            rejected: payload.error,
          },
        })
      );
    }
    if (type === FULFILLED && id) {
      return set(
        path.concat("data"),
        state,
        (data: any) => ({
          ...data,
          [id]: {
            ...FULFILLED_TYPE,
            resolved: payload.data,
          },
        })
      );
    }
    if (type === PENDING) {
      return set(
        path.concat("queries"),
        state,
        (queries: any) => ({
          ...queries,
          [queryToString(query)]: {
            ...queries[queryToString(query)],
            ...PENDING_TYPE,
          },
        })
      );
    }
    if (type === FULFILLED) {
      return set(path, state, (entityState: any) => ({
        ...entityState,
        queries: {
          ...entityState.queries,
          [queryToString(query)]: asResult({
            ids: getDataFromApiResult(payload, query).map(
              getId
            ),
            meta: getMetaFromApiResult(payload, query),
          }),
        },
        data: {
          ...entityState.data,
          ...Object.fromEntries(
            getDataFromApiResult(
              payload,
              query
            ).map((item: any) => [
              getId(item),
              asResult(item),
            ])
          ),
        },
      }));
    }
    if (type === REJECTED) {
      return set(
        path.concat("queries"),
        state,
        (queries: any) => ({
          ...queries,
          [queryToString(query)]: {
            ...queries[queryToString(query)],
            ...FULFILLED_TYPE,
            rejected: payload.error,
          },
        })
      );
    }
    return state;
  };
  const types = {
    PENDING,
    FULFILLED,
    REJECTED,
  };
  const creators = {
    pending: (query: any) => ({
      type: PENDING,
      payload: { query },
    }),
    fulfilled: (query: any, data: any) => ({
      type: FULFILLED,
      payload: { query, data },
    }),
    rejected: (query: any, error: any) => ({
      type: REJECTED,
      payload: { query, error },
    }),
  };
  const thunk = (query: any) => (
    dispatch: any,
    getState: any
  ) => {
    const result = createSelectResult(query)(getState());
    if (isRequested(result)) {
      return Promise.resolve();
    }
    dispatch(creators.pending(query));
    return fetch(...createFetchArgs(query)).then(
      (resolve: any) =>
        dispatch(creators.fulfilled(query, resolve)),
      (error: any) =>
        dispatch(creators.rejected(query, error))
    );
  };
  return {
    createSelectResult,
    reducer,
    actions: {
      types,
      creators,
    },
    thunk,
  };
};
export default createBridge;
