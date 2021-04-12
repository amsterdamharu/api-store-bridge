//@todo: use actual auth to set token and get it from localstorage
//  use refresh token if available
const withAuth = (fn: any) => (
  url: string,
  config: any = {}
) =>
  fn(url, {
    ...config,
    headers: [
      ...(config.headers || []),
      [
        'authorization',
        'Bearer WlKI1iuHY1RSaT9a4MxR1LIk6bEzIK7I',
      ],
    ],
  });
export default withAuth;
