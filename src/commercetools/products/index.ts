import { createSelector } from 'reselect';
import createBridge from '../../data/apiStoreBridge';
import fetchJson from '../fetchJson';
import { selectPreferences } from '../selectors';

const { thunk, createSelectResult, reducer } = createBridge(
  {
    getId: (arg) => arg.id,
    path: ['data', 'products'],
    entityName: 'products',
    fetch: fetchJson,
    createFetchArgs: (query: any) => {
      //@todo: build url in external function
      const url = new URL(
        `https://api.europe-west1.gcp.commercetools.com/${process.env.REACT_APP_PROJECT_KEY}/product-projections/search?priceCurrency=USD&priceCountry=US&limit=2&offset=0`
      );
      if (query.page) {
        url.searchParams.append('limit', '1');
        url.searchParams.append('offset', query.page);
      }
      if (query.country) {
        url.searchParams.append(
          'priceCountry',
          query.country
        );
      }
      if (query.currency) {
        url.searchParams.append(
          'priceCurrency',
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
export const selectProductQuery = createSelector(
  [selectPreferences],
  ({ country, locale, currency }) => ({
    country,
    locale,
    currency,
  })
);
