import React, { useEffect, useMemo } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  activeCartThunk,
  productsCreateSelectResult,
  productsThunk,
  createCartThunk,
} from './commercetools';
//@todo: click a button to add to cart
const query = {
  currency: 'USD',
  country: 'US',
};
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    // dispatch(productsThunk(query));
    // dispatch(activeCartThunk(query));
    dispatch(createCartThunk(query));
  }, [dispatch]);
  const selectProducts = useMemo(
    () => productsCreateSelectResult(query),
    []
  );
  // const productResult = useSelector(selectProducts);
  const productResult = '';
  return (
    <div>
      <pre>
        {JSON.stringify(productResult, undefined, 2)}
      </pre>
    </div>
  );
}

export default App;
