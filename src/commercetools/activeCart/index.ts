import createApiStoreAction from '../../data/apiStoreAction';
import createBridge from '../../data/apiStoreBridge';
import { promiseResults } from '../../data/result';
import fetchJson from '../fetchJson';
import { selectPreferences } from '../selectors';

const bridge = createBridge({
  getId: () => 'active',
  path: ['data', 'cart'],
  entityName: 'cart',
  fetch: fetchJson,
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
  thunk: addLineThunk,
  createSelectResult: addLineCreateSelect,
  reducer: addLineReducer,
  actions: addLineActions,
} = createApiStoreAction(bridge, {
  actionName: 'addLine',
  fetch: fetchJson,
  createFetchArgs: (query: any) => {
    const {
      cartId,
      version,
      productId,
      variantId,
      quantity = 1,
    } = query;
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
//@todo create action to set shipping address:
//   https://docs.commercetools.com/api/projects/carts#set-shipping-address
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
export const addCartLineThunk = (query: any) => (
  dispatch: any,
  getState: any
) => {
  return activeCartThunk(query)(dispatch, getState).then(
    () => {
      return promiseResults(
        activeCartCreateSelectResult(query)(getState())
      )
        .then(
          ([cart]: any[]) => {
            const newQuery = {
              ...query,
              cartId: cart.id,
              version: cart.version,
            };
            return addLineThunk(newQuery)(
              dispatch,
              getState
            ).then(() => newQuery);
          },
          () => {
            //cart does not exist
            return createCartThunk(
              selectPreferences(getState())
            )(dispatch, getState).then(() =>
              addCartLineThunk(query)(dispatch, getState)
            );
          }
        )
        .then((query) => {
          return dispatch(
            addLineActions.creators.remove(query)
          );
        });
    }
  );
};
export const addCartLineCreateSelect = addLineCreateSelect;
export const addCartLineReducer = createSetDataOnUpdate(
  addLineActions.types.FULFILLED,
  addLineReducer
);
export const actions = {
  get: bridge.actions,
  crate: createActions,
  addLine: addLineActions,
};
