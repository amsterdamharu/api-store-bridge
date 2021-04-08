import React, {
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { useDispatch } from 'react-redux';
import {
  addCartLineThunk,
} from '../commercetools';
function Product({ product }: any) {
  const dispatch = useDispatch();
  const addToCart = useCallback(() => {
    dispatch(
      addCartLineThunk({
        productId: product.id,
        variantId: product.masterVariant.id,
      })
    );
  }, [
    dispatch,
    product.id,
    product.masterVariant.id,
  ]);
  return (
    <li>
      <div>{product.name.en}</div>
      <div>
        <button onClick={addToCart}>Add to cart</button>
      </div>
    </li>
  );
}

export default Product;
