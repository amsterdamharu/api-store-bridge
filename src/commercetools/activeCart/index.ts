import createApiStoreAction from '../../data/apiStoreAction';
import createBridge from '../../data/apiStoreBridge';
import { promiseResults } from '../../data/result';
import fetchJson from '../fetchJson';
import {
  createGroup,
  createPromiseSessionCache,
} from '../group';
import { selectPreferences } from '../selectors';
const group = createGroup(createPromiseSessionCache());
const bridge = createBridge({
  getId: () => 'active',
  path: ['data', 'cart'],
  entityName: 'cart',
  fetch: group(fetchJson),
  createFetchArgs: () => {
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
  fetch: fetchJson,
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
  thunk: rawCartActionThunk,
  createSelectResult: rawCartActionCreateSelect,
  reducer: rawReducer,
  actions: rawCartActions,
} = createApiStoreAction(bridge, {
  actionName: 'cartAction',
  fetch: fetchJson,
  createFetchArgs: (query: any) => {
    const {
      cartId,
      version,
      productId,
      variantId,
      quantity = 1,
      shippingAddress,
    } = query;
    let body;
    if (productId && variantId && quantity) {
      body = JSON.stringify({
        version,
        actions: [
          {
            action: 'addLineItem',
            productId,
            variantId,
            quantity,
          },
        ],
      });
    }
    if (shippingAddress) {
      body = JSON.stringify({
        version,
        actions: [
          {
            action: 'setShippingAddress',
            address: shippingAddress,
          },
        ],
      });
    }
    return [
      `https://api.europe-west1.gcp.commercetools.com/${process.env.REACT_APP_PROJECT_KEY}/me/carts/${cartId}`,
      {
        headers: [],
        method: 'POST',
        body,
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
  return activeCartThunk(query)(dispatch, getState)
    .then(() =>
      promiseResults(
        activeCartCreateSelectResult(query)(getState())
      )
    )
    .then(
      ([result]: any[]) => result,
      () => dispatch(createThunk(query))
    );
};
export const createCartReducer = createSetDataOnUpdate(
  createActions.types.FULFILLED,
  createReducer
);
export const cartActionThunk = (query: any) => (
  dispatch: any,
  getState: any
) => {
  return activeCartThunk(query)(dispatch, getState).then(
    () => {
      return promiseResults(
        activeCartCreateSelectResult(query)(getState())
      ).then(
        ([cart]: any[]) => {
          const newQuery = {
            ...query,
            cartId: cart.id,
            version: cart.version,
          };
          return rawCartActionThunk(newQuery)(
            dispatch,
            getState
          ).then(({ payload }: any) => payload);
        },
        () => {
          //cart does not exist
          return createCartThunk(
            selectPreferences(getState())
          )(dispatch, getState).then(() =>
            cartActionThunk(query)(dispatch, getState)
          );
        }
      );
    }
  );
};
export const cartActionCreateSelect = rawCartActionCreateSelect;
export const cartActionReducer = createSetDataOnUpdate(
  rawCartActions.types.FULFILLED,
  rawReducer
);
export const actions = {
  get: bridge.actions,
  crate: createActions,
  actions: rawCartActions,
};
