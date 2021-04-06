//@todo: ssr render, import fetch from
//  winFetch so ssr can easily override
const fetchJson = (fn: any = fetch) => (a: any, b: any) =>
  fn(a, b).then((r: any) => r.json());
export default fetchJson;
