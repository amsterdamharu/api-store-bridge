import React, {
  useCallback,
} from 'react';
import useCart from '../commercetools/hooks/useCart';
function Product({ product }: any) {
  const { addToCart } = useCart();
  const addHandler = useCallback(() => {
    addToCart(product.id, product.masterVariant.id);
  }, [addToCart, product.id, product.masterVariant.id]);
  return (
    <li>
      <div>{product.name.en}</div>
      <div>
        <button onClick={addHandler}>Add to cart</button>
      </div>
    </li>
  );
}

export default Product;
