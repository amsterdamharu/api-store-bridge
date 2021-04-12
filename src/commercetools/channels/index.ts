import createBridge from '../../data/apiStoreBridge';
import fetchJson from '../fetchJson';

const bridge = createBridge({
  getId: ({ id }) => id,
  path: ['data', 'channels'],
  entityName: 'channels',
  fetch: fetchJson,
  createFetchArgs: (query) => {
    return [
      `https://api.europe-west1.gcp.commercetools.com/${process.env.REACT_APP_PROJECT_KEY}/channels`,
      { headers: [] },
    ];
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
