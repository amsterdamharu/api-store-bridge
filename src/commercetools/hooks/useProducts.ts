import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  productsCreateSelectResult,
  productsThunk,
  selectProductQuery,
} from '../products';
export default function useProducts() {
  const dispatch = useDispatch();
  const query: any = useSelector(selectProductQuery);
  useEffect(() => {
    dispatch(productsThunk(query));
  }, [dispatch, query]);
  const selectProducts = useMemo(
    () => productsCreateSelectResult(query),
    [query]
  );
  return useSelector(selectProducts);
}
