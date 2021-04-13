import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  channelsCreateSelectResult,
  channelsThunk,
} from '../channels';
const EMPTY_QUERY = {};
export default function useChannels(query = EMPTY_QUERY) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(channelsThunk(query));
  }, [dispatch, query]);
  const selectChannels = useMemo(
    () => channelsCreateSelectResult(query),
    [query]
  );
  return useSelector(selectChannels);
}
