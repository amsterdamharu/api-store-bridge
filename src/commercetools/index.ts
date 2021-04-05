/* eslint-disable import/no-anonymous-default-export */
import createBridge from "../data/apiStoreBridge";

//@todo: move to withAuth and also create withReject
const authHeader = [
  "authorization",
  "Bearer Ju5FIALPQFcGXIFD6cXRMokZkGWdVkcP",
];
//@todo: move these to their own files at some point
const { thunk, createSelectResult, reducer } = createBridge(
  {
    getId: (arg) => arg.id,
    path: ["data", "products"],
    entityName: "products",
    fetch: (a: any, b: any) => {
      const withHeaders = {
        ...b,
        headers: [...b.headers, authHeader],
      };
      return fetch(a, withHeaders).then((r) => r.json());
    },
    createFetchArgs: (query) => {
      return [
        "https://api.europe-west1.gcp.commercetools.com/sunrise-spa/product-projections/search?priceCurrency=USD&priceCountry=US&limit=2&offset=0",
        { headers: [] },
      ];
    },
    getDataFromApiResult: (result: any) =>
      result.data.results,
    getMetaFromApiResult: (result: any) =>
      result.data.total,
  }
);
const {
  thunk: thunkC,
  createSelectResult: createSelectResultC,
  reducer: reducerC,
} = createBridge({
  getId: (arg) => arg.id,
  path: ["data", "cart"],
  entityName: "cart",
  fetch: (a: any, b: any) => {
    const withHeaders = {
      ...b,
      headers: [...b.headers, authHeader],
    };
    return fetch(a, withHeaders).then((r) => r.json());
  },
  createFetchArgs: (query) => {
    return [
      "https://api.europe-west1.gcp.commercetools.com/sunrise-spa/me/active-cart",
      { headers: [] },
    ];
  },
  getDataFromApiResult: (result: any) =>
    result.data.results,
  getMetaFromApiResult: (result: any) => result.data.total,
});

export const productsThunk = thunk;
export const createSelectProductResult = createSelectResult;
export const productReducer = reducer;
export const cartThunk = thunkC;
export const createSelectCartResult = createSelectResultC;
export const cartReducer = reducerC;
