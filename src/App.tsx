import React, { useEffect, useMemo } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { createSelectProductResult, productsThunk } from './commercetools';
//@todo: click a button to add to cart
const query = {}
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(productsThunk(query))
  }, [dispatch])
  const selectProducts = useMemo(
    () => createSelectProductResult(query), []
  )
  const productResult = useSelector(selectProducts);
  return (
    <div>
      <pre>{JSON.stringify(productResult, undefined, 2)}</pre>
    </div>
  );
}

export default App;
