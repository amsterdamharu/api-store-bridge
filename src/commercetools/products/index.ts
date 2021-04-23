import { createSelector } from 'reselect';
import createBridge from '../../data/apiStoreBridge';
import fetchJson from '../fetchJson';
import makeUrl from '../makeUrl';
import { selectPreferences } from '../selectors';

const { thunk, createSelectResult, reducer } = createBridge(
  {
    getId: (arg) => arg.id,
    path: ['data', 'products'],
    entityName: 'products',
    fetch: fetchJson,
    createFetchArgs: (query: any) => {
      const url = makeUrl('product-projections/search');
      url.searchParams.append('limit', '30');
      if (query.page) {
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
