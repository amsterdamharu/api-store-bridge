import createApiStoreAction from '../../data/apiStoreAction';
import createBridge from '../../data/apiStoreBridge';
import { promiseResults } from '../../data/result';
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
  getDataFromApiResult: (result: any) => {
    return result.data;
  },
  getMetaFromApiResult: () => null,
});
const {
  thunk: addLineThunk,
  createSelectResult: addLineCreateSelect,
  reducer: addLineReducer,
  actions: addLineActions,
} = createApiStoreAction(bridge, {
  actionName: 'addLine',
  fetch: withAuth(fetchJson()),
  createFetchArgs: (query: any) => {
    //@todo: get the current cart??
    const cartId = '0ac30cd0-11cb-4bf0-b182-0f674abe188f';
    //@todo: this should come from cart
    const version = 15;
    const { productId, variantId, quantity = 1 } = query;
    return [
      `https://api.europe-west1.gcp.commercetools.com/${process.env.REACT_APP_PROJECT_KEY}/me/carts/${cartId}`,
      {
        headers: [],
        method: 'POST',
        body: JSON.stringify({
          version,
          actions: [
            {
              action: 'addLineItem',
              productId,
              variantId,
              quantity,
            },
          ],
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
const createSetDataOnUpdate = (
  onAction: any,
  reducer: any
) => (state: any, action: any) => {
  const newState = reducer(state, action);
  if (action.type === onAction) {
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
export const activeCartThunk = thunk;
export const activeCartCreateSelectResult = createSelectResult;
export const activeCartReducer = reducer;
export const createCartCreateSelectResult = createCreateSelectResult;
export const createCartThunk = (query: any) => (
  dispatch: any,
  getState: any
) => {
  //only create when it's not created
  return promiseResults(
    createCartCreateSelectResult(query)(getState())
  ).then(
    ([result]) => result,
    () => dispatch(createThunk(query))
  );
};

//createThunk;

export const createCartReducer = createSetDataOnUpdate(
  createActions.types.FULFILLED,
  createReducer
);
//@todo: cannot add same line, query is same so thunk
//  thinks it does not need to do anything
//@todo: create cart if it doesn't exist
export const addCartLineThunk = addLineThunk;
export const addCartLineCreateSelect = addLineCreateSelect;
export const addCartLineReducer = createSetDataOnUpdate(
  addLineActions.types.FULFILLED,
  addLineReducer
);
