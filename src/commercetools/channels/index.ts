import createBridge from '../../data/apiStoreBridge';
import fetchJson from '../fetchJson';
import makeUrl from '../makeUrl';

const bridge = createBridge({
  getId: ({ id }) => id,
  path: ['data', 'channels'],
  entityName: 'channels',
  fetch: fetchJson,
  createFetchArgs: (query: any) => {
    const url = makeUrl('channels/');
    if (query?.country) {
      url.searchParams.append(
        'where',
        `address(country="${query.country}")`
      );
    }
    return [url, { headers: [] }];
  },
  getDataFromApiResult: (result: any) =>
    result.data.results,
  getMetaFromApiResult: (result: any) => result.data.total,
});
const { thunk, createSelectResult, reducer } = bridge;

export const channelsThunk = thunk;
export const channelsCreateSelectResult = createSelectResult;
export const channelsReducer = reducer;
export const actions = {
  get: bridge.actions,
};
