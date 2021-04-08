//@todo: ssr render, import fetch from

import withAuth from './withAuth';
import withError from './withError';

//  winFetch so ssr can easily override
const fetchJson = (fn: any = fetch) => (a: any, b: any) =>
  fn(a, b).then((r: any) => r.json());
export default withAuth(fetchJson(withError(fetch)));
