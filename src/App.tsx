import React, { useEffect, useMemo } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  activeCartThunk,
  productsCreateSelectResult,
  productsThunk,
  createCartThunk,
} from './commercetools';
import Product from './components/Product';
//@todo: click a button to add to cart
const query = {
  currency: 'USD',
  country: 'US',
};
function App() {
  const dispatch = useDispatch();
  (window as any).d = dispatch;
  (window as any).createCartThunk = createCartThunk;
  useEffect(() => {
    dispatch(productsThunk(query));
    // dispatch(activeCartThunk(query));
    // dispatch(createCartThunk(query));
  }, [dispatch]);
  const selectProducts = useMemo(
    () => productsCreateSelectResult(query),
    []
  );
  const productResult = useSelector(selectProducts);
  return (
    <div>
      <ul>
        {(productResult.resolved?.items || []).map(
          (product: any) => (
            <Product key={product.id} product={product} />
          )
        )}
      </ul>
    </div>
  );
}

export default App;
