export const selectPath = (
  path: string[],
  state: any
): any =>
  path.length === 0
    ? state
    : selectPath(path.slice(1), state[path[0]]);
export function set(
  path: string[],
  state: any,
  callback: any
): any {
  if (path.length === 0) {
    return callback(state);
  }
  if (path.length === 1) {
    return {
      ...state,
      [path[0]]: callback(state[path[0]]),
    };
  }
  const current: any = state[path[0]];
  return {
    ...state,
    [path[0]]: {
      ...current,
      ...set(path.slice(1), current, callback),
    },
  };
}
