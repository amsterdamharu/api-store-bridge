//reducer with page needs function to get data and meta from api result
//test page reducer for requested, succeeded and failed
//no container that passes props, you should make it yourself
// so it is not react specific
import {
  AVAILABLE,
  isRequested,
  LOADING,
  mapResults,
  asResult,
  NOT_REQUESTED,
} from "./result";
const windowFetch = fetch;
//should have no react no redux, only reselect
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
}: Arg) => {
  const createSelectResult = (query: any) => (
    state: any
  ) => {
    if (getId(query)) {
      return asResult(
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
  };
  const REQUESTED = `${entityName.toUpperCase()}_REQUESTED`;
  const SUCCEEDED = `${entityName.toUpperCase()}_SUCCEEDED`;
  const FAILED = `${entityName.toUpperCase()}_FAILED`;
  const reducer = (
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
    if (type === REQUESTED) {
      return set(
        path.concat("queries"),
        state,
        (queries: any) => ({
          ...queries,
          [queryToString(query)]: {
            ...queries[queryToString(query)],
            ...LOADING,
          },
        })
      );
    }
    if (type === SUCCEEDED) {
      return set(path, state, (entityState: any) => ({
        ...entityState,
        queries: {
          ...entityState.queries,
          [queryToString(query)]: asResult(
            //@todo: need also meta data for paging
            payload.data.map(getId)
          ),
        },
        data: {
          ...entityState.data,
          ...Object.fromEntries(
            payload.data.map((item: any) => [
              [getId(item), asResult(item)],
            ])
          ),
        },
      }));
    }
    if (type === FAILED) {
      return set(
        path.concat("queries"),
        state,
        (queries: any) => ({
          ...queries,
          [queryToString(query)]: {
            ...queries[queryToString(query)],
            ...AVAILABLE,
            error: payload.error,
          },
        })
      );
    }
    return state;
  };
  const types = {
    REQUESTED,
    SUCCEEDED,
    FAILED,
  };
  const creators = {
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
  };
  const thunk = (query: any) => (
    dispatch: any,
    getState: any
  ) => {
    const result = createSelectResult(query)(getState());
    if (isRequested(result)) {
      return Promise.resolve();
    }
    dispatch(creators.requested(query));
    return fetch(...createFetchArgs(query)).then(
      (resolve: any) =>
        dispatch(creators.succeeded(query, resolve)),
      (error: any) =>
        dispatch(creators.failed(query, error))
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
