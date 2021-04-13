import { selectPath, set } from './common';
import {
  FULFILLED as FULFILLED_TYPE,
  isRequested,
  PENDING as PENDING_TYPE,
  mapResults,
  asResult,
  NOT_CREATED,
} from './result';
const NONE = {};
const createApiStoreAction = (
  apiStoreBridge: any,
  {
    queryToString = NONE,
    fetch = NONE,
    createFetchArgs = NONE,
    getDataFromApiResult = NONE,
    getMetaFromApiResult = NONE,
    actionName,
  }: any
) => {
  queryToString =
    queryToString === NONE
      ? apiStoreBridge.queryToString
      : queryToString;
  fetch = fetch === NONE ? apiStoreBridge.fetch : fetch;
  createFetchArgs =
    createFetchArgs === NONE
      ? apiStoreBridge.createFetchArgs
      : createFetchArgs;
  getDataFromApiResult =
    getDataFromApiResult === NONE
      ? apiStoreBridge.getDataFromApiResult
      : getDataFromApiResult;
  getMetaFromApiResult =
    getMetaFromApiResult === NONE
      ? apiStoreBridge.getMetaFromApiResult
      : getMetaFromApiResult;
  const path = apiStoreBridge.path.concat(['actions']);
  const entityName = apiStoreBridge.entityName;
  const createSelectResult = (query: any) => (
    state: any
  ) => {
    const actionsState: any = selectPath(path, state);
    const actionState = actionsState[actionName] || {};
    return mapResults(
      actionState[queryToString(query)] || NOT_CREATED
    )((result: any) => result);
  };
  const PRE = `${entityName.toUpperCase()}_${actionName.toUpperCase()}`;
  const PENDING = `${PRE}_PENDING`;
  const FULFILLED = `${PRE}_FULFILLED`;
  const REJECTED = `${PRE}_REJECTED`;
  const REMOVE = `${PRE}_REMOVE`;

  const reducer = (
    state: any,
    { type, payload = {} }: { type: string; payload?: any }
  ) => {
    const { query = {} } = payload;
    if (type === REMOVE) {
      return set(path, state, (actions: any) => {
        return {
          ...actions,
          [actionName]: {
            ...Object.fromEntries(
              Object.entries(actions[actionName]).filter(
                ([key]) => key !== queryToString(query)
              )
            ),
          },
        };
      });
    }
    if (type === PENDING) {
      return set(path, state, (actions: any) => ({
        ...actions,
        [actionName]: {
          ...actions[actionName],
          [queryToString(query)]: {
            ...actions[actionName]?.[queryToString(query)],
            ...PENDING_TYPE,
          },
        },
      }));
    }
    if (type === FULFILLED) {
      return set(path, state, (actions: any) => ({
        ...actions,
        [actionName]: {
          ...actions[actionName],
          [queryToString(query)]: asResult({
            data: getDataFromApiResult(payload, query),
            meta: getMetaFromApiResult(payload, query),
          }),
        },
      }));
    }
    if (type === REJECTED) {
      return set(path, state, (actions: any) => ({
        ...actions,
        [actionName]: {
          ...actions[actionName],
          [queryToString(query)]: {
            ...FULFILLED_TYPE,
            rejected: payload.error,
          },
        },
      }));
    }
    return state;
  };
  const types = {
    PENDING,
    FULFILLED,
    REJECTED,
  };
  const creators = {
    remove: (query: any) => ({
      type: REMOVE,
      payload: { query },
    }),
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
      (error: any) => {
        dispatch(creators.rejected(query, error));
        return Promise.reject(error);
      }
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
export default createApiStoreAction;
