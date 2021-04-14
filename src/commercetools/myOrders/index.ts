import createApiStoreAction from '../../data/apiStoreAction';
import createBridge from '../../data/apiStoreBridge';
import fetchJson from '../fetchJson';
import makeUrl from '../makeUrl';

const bridge = createBridge({
  getId: ({ id }) => id,
  path: ['data', 'orders'],
  entityName: 'order',
  fetch: fetchJson,
  createFetchArgs: (query) => {
    const { id }: any = query;
    return [
      makeUrl(`/me/orders/${id || ''}`),
      { headers: [] },
    ];
  },
  getDataFromApiResult: (result: any) =>
    result.data.results,
  getMetaFromApiResult: (result: any) => result.data.total,
});
const {
  thunk: createThunk,
  createSelectResult: createCreateSelectResult,
  reducer: createReducer,
  actions: createActions,
} = createApiStoreAction(bridge, {
  actionName: 'create',
  fetch: fetchJson,
  createFetchArgs: (query: any) => {
    const { cartId, cartVersion } = query;
    return [
      makeUrl('me/orders'),
      {
        headers: [],
        method: 'POST',
        body: JSON.stringify({
          id: cartId,
          version: cartVersion,
        }),
      },
    ];
  },
  getDataFromApiResult: (result: any) => {
    return result.data;
  },
  getMetaFromApiResult: () => null,
});

const { thunk, createSelectResult, reducer } = bridge;

export const myOrderThunk = thunk;
export const myOrderCreateSelectResult = createSelectResult;
export const myOrderCartReducer = reducer;
export const orderFromCartCreateSelectResult = createCreateSelectResult;
export const orderFromCartThunk = createThunk;
export const orderFromCartReducer = (
  state: any,
  action: any
) => {
  const newState = createReducer(state, action);
  return reducer(
    newState,
    bridge.actions.creators.fulfilled(
      action.payload.query,
      action.payload.data
    )
  );
};
export const actions = {
  get: bridge.actions,
  crate: createActions,
};
