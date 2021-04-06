import createBridge from "../../data/apiStoreBridge";
import fetchJson from "../fetchJson";
import withAuth from "../withAuth";

const { thunk, createSelectResult, reducer } = createBridge(
  {
    getId: () => "active",
    path: ["data", "cart"],
    entityName: "cart",
    fetch: withAuth(fetchJson()),
    createFetchArgs: (query) => {
      return [
        "https://api.europe-west1.gcp.commercetools.com/sunrise-spa/me/active-cart",
        { headers: [] },
      ];
    },
    getDataFromApiResult: (result: any) =>
      result.data.results,
    getMetaFromApiResult: (result: any) =>
      result.data.total,
  }
);
//@todo: create action to create cart (if not created)
//@todo: create action to add line item (dispatch add cart)
export const activeCartThunk = thunk;
export const activeCartCreateSelectResult = createSelectResult;
export const activeCartReducer = reducer;
