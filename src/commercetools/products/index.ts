import createBridge from "../../data/apiStoreBridge";
import fetchJson from "../fetchJson";
import withAuth from "../withAuth";

const { thunk, createSelectResult, reducer } = createBridge(
  {
    getId: (arg) => arg.id,
    path: ["data", "products"],
    entityName: "products",
    fetch: withAuth(fetchJson()),
    createFetchArgs: (query: any) => {
      //@todo: build url on env and send params in query
      const url = new URL(
        "https://api.europe-west1.gcp.commercetools.com/sunrise-spa/product-projections/search?priceCurrency=USD&priceCountry=US&limit=2&offset=0"
      );
      if (query.page) {
        url.searchParams.append("limit", "1");
        url.searchParams.append("offset", query.page);
      }
      if (query.country) {
        url.searchParams.append(
          "priceCountry",
          query.country
        );
      }
      if (query.currency) {
        url.searchParams.append(
          "priceCurrency",
          query.currency
        );
      }
      return [url, { headers: [] }];
    },
    getDataFromApiResult: (result: any) =>
      result.data.results,
    getMetaFromApiResult: (result: any) =>
      result.data.total,
  }
);
export const productsThunk = thunk;
export const productsCreateSelectResult = createSelectResult;
export const productsReducer = reducer;
