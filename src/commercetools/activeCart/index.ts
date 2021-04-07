import createApiStoreAction from '../../data/apiStoreAction';
import createBridge from '../../data/apiStoreBridge';
import fetchJson from '../fetchJson';
import withAuth from '../withAuth';

const bridge = createBridge({
  getId: () => 'active',
  path: ['data', 'cart'],
  entityName: 'cart',
  fetch: withAuth(fetchJson()),
  createFetchArgs: (query) => {
    return [
      `https://api.europe-west1.gcp.commercetools.com/${process.env.REACT_APP_PROJECT_KEY}/me/active-cart`,
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
  fetch: withAuth(fetchJson()),
  createFetchArgs: (query: any) => {
    return [
      `https://api.europe-west1.gcp.commercetools.com/${process.env.REACT_APP_PROJECT_KEY}/me/carts`,
      {
        headers: [],
        method: 'POST',
        body: JSON.stringify({
          currency: query.currency,
          country: query.country,
        }),
      },
    ];
  },
  getDataFromApiResult: (result: any) =>
    result.data.results,
  getMetaFromApiResult: () => null,
});
const { thunk, createSelectResult, reducer } = bridge;
//@todo: create action to add line item (dispatch add cart)
export const activeCartThunk = thunk;
export const activeCartCreateSelectResult = createSelectResult;
export const activeCartReducer = reducer;
//@todo: thunk should not create when cart exist
export const createCartThunk = createThunk;
export const createCartCreateSelectResult = createCreateSelectResult;
export const createCartReducer = (
  state: any,
  action: any
) => {
  const newState = createReducer(state, action);
  if (action.type === createActions.types.FULFILLED) {
    return activeCartReducer(
      newState,
      bridge.actions.creators.fulfilled(
        action.payload.query,
        action.payload.data
      )
    );
  }
  return newState;
};
