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
        "Bearer 7GubD3pOmOJ-z_cxB2PKVZuxY54I8YG0",
      ],
    ],
  });
export default withAuth;
