import { encode } from 'js-base64';
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
const refreshOrCreateToken = () => {
  return getTokenFromRefreshToken().catch(() => getToken());
};
const withAuth = (fn: any) => {
  const token = localStorage.getItem('accessToken');
  return (url: string, config: any = {}) => {
    function doRequest() {
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
