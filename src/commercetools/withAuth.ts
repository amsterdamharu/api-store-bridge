//@todo: using fetch here will break ssr, need to import from somewhere
//@todo: tokens should be stored in redux
//   with ssr token should be sent by client
//   if not sent then created by server but
//   saved on client for session
import { encode } from 'js-base64';
import {
  createGroup,
  createPromiseSessionCache,
} from './group';
const createAuth = () =>
  encode(
    `${process.env.REACT_APP_CLIENT_ID}:${process.env.REACT_APP_CLIENT_SECRET}`
  );
const saveToken = ({
  access_token,
  refresh_token,
}: any) => {
  localStorage.setItem('accessToken', access_token);
  localStorage.setItem('refreshToken', refresh_token);
};
const getToken = () => {
  const auth = createAuth();
  const scope = encodeURI(
    process.env.REACT_APP_SCOPE as string
  );
  return fetch(
    `${process.env.REACT_APP_AUTH_HOST}/oauth/${process.env.REACT_APP_PROJECT_KEY}/anonymous/token`,
    {
      headers: {
        authorization: `Basic ${auth}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&scope=${scope}`,
      method: 'POST',
    }
  )
    .then((response) =>
      response.ok
        ? response.json()
        : Promise.reject(response)
    )
    .then(saveToken);
};
const getTokenFromRefreshToken = () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (refreshToken) {
    const auth = createAuth();
    return fetch(
      `${process.env.REACT_APP_AUTH_HOST}/oauth/${process.env.REACT_APP_PROJECT_KEY}/anonymous/token`,
      {
        headers: {
          authorization: `Basic ${auth}`,
          'content-type':
            'application/x-www-form-urlencoded',
        },
        body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
        method: 'POST',
      }
    )
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then(saveToken);
  }
  return getToken();
};
const group = createGroup(createPromiseSessionCache());
//this function is grouped so all request will use this one
//  cache only for the duration of all async calls to finish
const refreshOrCreateToken = group(() => {
  return getTokenFromRefreshToken().catch(() => getToken());
});
const withAuth = (fn: any) => {
  return (url: string, config: any = {}) => {
    function doRequest() {
      const token = localStorage.getItem('accessToken');
      return fn(url, {
        ...config,
        headers: [
          ...(config.headers || []),
          ['authorization', `Bearer ${token}`],
        ],
      });
    }
    return doRequest().catch((e: any) => {
      if (e?.status === 401) {
        return refreshOrCreateToken().then(() =>
          doRequest()
        );
      }
      return Promise.reject(e);
    });
  };
};
export default withAuth;
