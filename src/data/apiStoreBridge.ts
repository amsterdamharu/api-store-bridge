//selectors (needs stringFromQuery and getId)
//reducer
//returns action types, action creators, thunk actions
//container that passes props
// not react just call component with Component(props)

import { mapResults, NOT_REQUESTED } from "./result";

//should have no react no redux, only reselect
interface Id {
  id: string | number;
}
interface Arg {
  getId?: (arg0: Id) => string | number;
  path?: string[];
  queryToString?: (arg0: object) => string;
}
const selectPath = (path: string[], state: any): any =>
  path.length === 0
    ? state
    : selectPath(path.slice(1), state[path[0]]);
const createBridge = ({
  getId = ({ id }: Id) => id,
  path = [],
  queryToString = (query) => JSON.stringify(query),
}: Arg = {}) => {
  const createSelectResult = (query: any) => (
    state: any
  ) => {
    if (getId(query)) {
      return (
        selectPath(path, state).data[getId(query)] ||
        NOT_REQUESTED
      );
    }
    return mapResults(
      selectPath(path, state).queries[
        queryToString(query)
      ] || NOT_REQUESTED
    )((ids: number[] | string[]) =>
      mapResults(
        ...ids.map(
          (id: any) => state.data[id] || NOT_REQUESTED
        )
      )((...items: any[]) => items)
    );
  };
  return {
    createSelectResult,
  };
};
export default createBridge;
