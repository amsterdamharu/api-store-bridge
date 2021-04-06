const withAuth = (fn: any) => (
  url: string,
  config: any = {}
) =>
  fn(url, {
    ...config,
    headers: [
      ...(config.headers || []),
      [
        "authorization",
        "Bearer Ju5FIALPQFcGXIFD6cXRMokZkGWdVkcP",
      ],
    ],
  });
export default withAuth;
