//group promise returning function
export const createGroup = (cache: any) => (
  fn: any,
  getKey = (...x: any[]) => JSON.stringify(x)
) => (...args: any[]) => {
  const key = getKey(args);
  let result = cache.get(key);
  if (result) {
    return result;
  }
  //no cache
  result = Promise.resolve(fn.apply(null, args)).then(
    (r) => {
      cache.resolved(key); //tell cache promise is done
      return r;
    },
    (e) => {
      cache.resolve(key); //tell cache promise is done
      return Promise.reject(e);
    }
  );
  cache.set(key, result);
  return result;
};
//thunk action creators are not (...args)=>result but
//  (...args)=>(dispatch,getState)=>result
//  so here is how we group thunk actions
export const createGroupedThunkAction = (
  thunkAction: any,
  cache: any
) => {
  const group = createGroup(
    cache
  )((args: any, dispatch: any, getState: any) =>
    thunkAction.apply(null, args)(dispatch, getState)
  );

  return (...args: any[]) => (
    dispatch: any,
    getState: any
  ) => {
    return group(args, dispatch, getState);
  };
};
//permanent memory cache store creator
export const createPermanentMemoryCache = (
  cache = new Map()
) => {
  return {
    get: (key: any) => cache.get(key),
    set: (key: any, value: any) => cache.set(key, value),
    resolved: (x: any) => x,
  };
};
//cache that removes item when removed when fulfilled or rejected
export const createPromiseSessionCache = (
  cache = new Map()
) => {
  return {
    get: (key: any) => cache.get(key),
    set: (key: any, value: any) => cache.set(key, value),
    resolved: (key: any) => cache.delete(key),
  };
};
