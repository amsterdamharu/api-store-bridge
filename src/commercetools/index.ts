/* eslint-disable import/no-anonymous-default-export */
import createBridge from "../data/apiStoreBridge";

const { thunk, createSelectResult, reducer } = createBridge(
  {
    getId: (arg) => arg.id,
    path: ["data", "products"],
    entityName: "products",
    fetch: (a: any, b: any) => {
      const withHeaders = {
        ...b,
        headers: [
          ...b.headers,
          [
            "authorization",
            "Bearer hm-pcIM3wKo4mztF1j8Dv4LQp7kitsUp",
          ],
        ],
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

export const productsThunk = thunk;
export const createSelectProductResult = createSelectResult;
export const productReducer = reducer;
