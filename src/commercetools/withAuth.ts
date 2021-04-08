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
        'Bearer EOea_uRwUdVry5ImbfdXd14zgNt-elaC',
      ],
    ],
  });
export default withAuth;
