import React, { useEffect, useMemo } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  productsCreateSelectResult,
  productsThunk,
  selectProductQuery,
} from './commercetools';
import Product from './components/Product';
import Checkout from './components/Checkout';
function App() {
  const dispatch = useDispatch();
  const query: any = useSelector(selectProductQuery);
  useEffect(() => {
    dispatch(productsThunk(query));
  }, [dispatch, query]);
  const selectProducts = useMemo(
    () => productsCreateSelectResult(query),
    [query]
  );
  const productResult = useSelector(selectProducts);
  return (
    <div>
      <div><Checkout /></div>
      <div>
        <ul>
          {(productResult.resolved?.items || []).map(
            (product: any) => (
              <Product key={product.id} product={product} />
            )
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
