const withError = (fn: any) => (
  url: string,
  config: any = {}
) =>
  fn(url, config).then((response: any) =>
    response.ok ? response : Promise.reject(response)
  );
export default withError;
